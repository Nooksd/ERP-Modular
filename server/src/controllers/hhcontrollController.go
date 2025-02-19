package controllers

import (
	"context"
	database "controll/src/db"
	"controll/src/models"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var hhCollection *mongo.Collection = database.OpenCollection(database.Client, "hhrecords")

func SendHH() gin.HandlerFunc {
	return func(c *gin.Context) {
		userClaims, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		claims, ok := userClaims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar token"})
			return
		}

		userId := claims["Uid"].(string)

		userID, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Id do usuário inválido.", "status": false})
			return
		}

		type HHRequestTemp struct {
			UserID    string                `json:"userId"`
			ProjectID string                `json:"projectId"`
			Date      string                `json:"date"`
			HHRecords []models.HHRecordItem `json:"hhRecords"`
		}

		var tempRequest HHRequestTemp
		if err := c.ShouldBindJSON(&tempRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false, "error": err.Error()})
			return
		}

		projectID, err := primitive.ObjectIDFromHex(tempRequest.ProjectID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Id do projeto inválido.", "status": false})
			return
		}

		layout := "2006-01-02"
		dateTime, err := time.Parse(layout, tempRequest.Date)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Formato de data inválido. Use YYYY-MM-DD", "status": false})
			return
		}

		var hhRequest models.HHRecord
		hhRequest.UserID = userID
		hhRequest.ProjectID = projectID
		hhRequest.Date = dateTime
		hhRequest.HHRecords = tempRequest.HHRecords
		hhRequest.CreatedAt = time.Now()

		var work models.Work

		err = workCollection.FindOne(context.Background(), bson.M{"_id": hhRequest.ProjectID}).Decode(&work)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Obra não encontrada.", "status": false})
			return
		}

		count, err := hhCollection.CountDocuments(context.Background(), bson.M{"date": hhRequest.Date, "projectId": hhRequest.ProjectID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao verificar dados", "status": false})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"message": "Já existe um registro de HH para esta data e projeto.", "status": false})
			return
		}

		for _, managerId := range work.ManagerIDs {
			if managerId.Hex() == userId {

				for _, record := range hhRequest.HHRecords {
					if record.Area == "" || record.Activity == "" || record.SubActivity == "" || record.WorkDescription == "" {
						c.JSON(http.StatusBadRequest, gin.H{"message": "Campos obrigatórios em hhRecords estão ausentes ou inválidos.", "status": false})
						return
					}
					if len(record.Roles) == 0 {
						c.JSON(http.StatusBadRequest, gin.H{"message": "Pelo menos um role deve ser definido em cada registro de HH.", "status": false})
						return
					}
					for _, role := range record.Roles {
						if role.Role == "" || role.Quantity <= 0 || role.Hours <= 0 {
							c.JSON(http.StatusBadRequest, gin.H{"message": "Campos obrigatórios em roles estão ausentes ou inválidos.", "status": false})
							return
						}
					}
				}

				_, err = hhCollection.InsertOne(context.Background(), hhRequest)

				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao salvar o registro de HH", "status": false})
					return
				}

				c.JSON(http.StatusCreated, gin.H{"message": "Registro de HH enviado com sucesso.", "status": true})
				return
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{"message": "Usuário não tem permissão para enviar HH para esta obra.", "status": false})
	}
}

func GetLastHHRecord() gin.HandlerFunc {
	return func(c *gin.Context) {
		userClaims, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		claims, ok := userClaims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar token"})
			return
		}

		userId := claims["Uid"].(string)
		projectId := c.Param("projectId")

		objctId, err := primitive.ObjectIDFromHex(projectId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Id da obra inválido.", "status": false})
			return
		}

		var work models.Work

		err = workCollection.FindOne(context.Background(), bson.M{"_id": objctId}).Decode(&work)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Obra não encontrada.", "status": false})
			return
		}

		for _, managerId := range work.ManagerIDs {
			if managerId.Hex() == userId {

				var hhRecord models.HHRecord

				err = hhCollection.FindOne(context.Background(), bson.M{"projectId": objctId}).Decode(&hhRecord)
				if err != nil {
					c.JSON(http.StatusNotFound, gin.H{"message": "Registro de HH não encontrado.", "status": false})
					return
				}

				c.JSON(http.StatusOK, gin.H{"message": "Registro de HH recente encontrado.", "status": true, "hhRecord": hhRecord})
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"message": "Usuário não tem permissão para esta obra.", "status": false})
	}
}

func GetHHRecordsByProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		userClaims, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		claims, ok := userClaims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar token"})
			return
		}
		userId := claims["Uid"].(string)
		projectId := c.Param("projectId")

		objctId, err := primitive.ObjectIDFromHex(projectId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Id da obra inválido.", "status": false})
			return
		}

		var work models.Work

		err = workCollection.FindOne(context.Background(), bson.M{"_id": objctId}).Decode(&work)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Obra não encontrada.", "status": false})
			return
		}

		for _, managerId := range work.ManagerIDs {
			if managerId.Hex() == userId {

				pageStr := c.DefaultQuery("page", "1")
				limitStr := c.DefaultQuery("limit", "10")
				startDate := c.DefaultQuery("startDate", "")
				endDate := c.DefaultQuery("endDate", "")
				order := c.DefaultQuery("order", "desc")

				page, err := strconv.Atoi(pageStr)
				if err != nil || page <= 0 {
					page = 1
				}

				limit, err := strconv.Atoi(limitStr)
				if err != nil || limit <= 0 {
					limit = 10
				}

				filter := bson.M{"projectId": objctId}

				if startDate != "" {
					filter["date"] = bson.M{"$gte": startDate}
				}
				if endDate != "" {
					if filter["date"] == nil {
						filter["date"] = bson.M{}
					}
					filter["date"].(bson.M)["$lte"] = endDate
				}

				skip := (page - 1) * limit

				sortValue := -1
				if order == "false" {
					sortValue = 1
				}
				sort := bson.M{"date": sortValue}

				totalRecords, err := hhCollection.CountDocuments(context.Background(), filter)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao contar registros.", "status": false})
					return
				}

				cursor, err := hhCollection.Find(
					context.Background(),
					filter,
					options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)).SetSort(sort),
				)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao listar os registros.", "status": false})
					return
				}
				defer cursor.Close(context.Background())

				var hhRecords []models.HHRecord
				if err := cursor.All(context.Background(), &hhRecords); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao mapear os registros.", "status": false})
					return
				}

				type HHRecordWithTotals struct {
					models.HHRecord
					Totals struct {
						TotalRoles      int     `json:"totalRoles"`
						TotalActivities int     `json:"totalActivities"`
						TotalHours      float64 `json:"totalHours"`
					} `json:"totals"`
				}

				var hhRecordsWithTotals []HHRecordWithTotals

				for _, record := range hhRecords {
					var recordWithTotals HHRecordWithTotals
					recordWithTotals.HHRecord = record

					totalRoles := 0
					totalActivities := len(record.HHRecords)
					totalHours := 0.0

					for _, hhRecord := range record.HHRecords {
						for _, role := range hhRecord.Roles {
							totalRoles += role.Quantity
							totalHours += float64(role.Quantity) * role.Hours
						}
					}

					recordWithTotals.Totals.TotalRoles = totalRoles
					recordWithTotals.Totals.TotalActivities = totalActivities
					recordWithTotals.Totals.TotalHours = totalHours

					hhRecordsWithTotals = append(hhRecordsWithTotals, recordWithTotals)
				}

				c.JSON(http.StatusOK, gin.H{
					"message":   "Registros de HH encontrados.",
					"hhRecords": hhRecordsWithTotals,
					"pagination": gin.H{
						"totalRecords": totalRecords,
						"totalPages":   (totalRecords + int64(limit) - 1) / int64(limit),
						"currentPage":  page,
					},
					"status": true,
				})
				return
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{"message": "Usuário não tem permissão para esta obra.", "status": false})
	}
}

func GetPdf() gin.HandlerFunc {
	return func(c *gin.Context) {
		pdfPath := filepath.Join("static", "Folha_InnovaEnergy_vazia.pdf")

		if _, err := os.Stat(pdfPath); os.IsNotExist(err) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Arquivo PDF não encontrado.", "status": false})
			return
		}

		c.File(pdfPath)
	}
}

func GetHHRecord() gin.HandlerFunc {
	return func(c *gin.Context) {
		recordId := c.Param("recordId")

		objctId, err := primitive.ObjectIDFromHex(recordId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
			return
		}

		var hhRecord models.HHRecord

		err = hhCollection.FindOne(c, bson.M{"_id": objctId}).Decode(&hhRecord)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Registro de HH não encontrado.",
				"status":  false,
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":  "Registro de HH encontrado.",
			"hhRecord": hhRecord,
			"status":   true,
		})
	}
}

func UpdateRecord() gin.HandlerFunc {
	return func(c *gin.Context) {
		recordId := c.Param("recordId")

		objctId, err := primitive.ObjectIDFromHex(recordId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
			return
		}

		var updateData bson.M

		if err := c.BindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao ler os dados de atualização"})
			return
		}

		filter := bson.M{"_id": objctId}
		update := bson.M{"$set": updateData}

		_, err = hhCollection.UpdateOne(context.Background(), filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Erro ao atualizar o registro de HH.",
				"status":  false,
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Registro de HH atualizado com sucesso.",
			"status":  true,
		})
	}
}

func DeleteRecord() gin.HandlerFunc {
	return func(c *gin.Context) {

		recordId := c.Param("recordId")

		objctId, err := primitive.ObjectIDFromHex(recordId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
			return
		}

		result, err := hhCollection.DeleteOne(context.Background(), bson.M{"_id": objctId})
		if err != nil || result.DeletedCount == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Erro ao excluir o registro de HH.",

				"status": false,
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Registro de HH excluído com sucesso.",
			"status":  true,
		})
	}
}

func GetStatistics() gin.HandlerFunc {
	return func(c *gin.Context) {
		projectId := c.Param("projectId")

		objctId, err := primitive.ObjectIDFromHex(projectId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
			return
		}

		cursor, err := hhCollection.Find(c, bson.M{"projectId": objctId})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Erro ao buscar registros de HH.",
				"status":  false,
			})
			return
		}
		defer cursor.Close(c)

		var hhRecords []models.HHRecord

		if err := cursor.All(c, &hhRecords); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Erro ao processar registros de HH.",
				"status":  false,
			})
			return
		}

		if len(hhRecords) == 0 {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Nenhum registro encontrado para o projeto.",
				"status":  false,
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":   "Registros encontrados com sucesso.",
			"hhRecords": hhRecords,
			"status":    true,
		})
	}
}
