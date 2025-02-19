package controllers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	database "controll/src/db"
	helper "controll/src/helpers"
	"controll/src/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var workCollection *mongo.Collection = database.OpenCollection(database.Client, "works")

func GetWork() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		workId := c.Param("workId")

		objctId, err := primitive.ObjectIDFromHex(workId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Função não encontrada", "status": false})
			return
		}
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		work := models.Work{}
		err = workCollection.FindOne(ctx, bson.M{"_id": objctId}).Decode(&work)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Obra não encontrada", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Obra encontrada com sucesso", "status": true, "work": work})
	}
}

func GetUserWorks() gin.HandlerFunc {
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
			c.JSON(http.StatusNotFound, gin.H{"message": "Função não encontrada", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		cursor, err := workCollection.Find(ctx, bson.M{"managerIds": userID, "isActive": true})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao buscar obras", "status": false})
			return
		}
		defer cursor.Close(ctx)

		var userWorks []models.Work
		if err := cursor.All(ctx, &userWorks); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
			return
		}

		if len(userWorks) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Usuário Sem Obras", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Obras do usuário encontradas com sucesso", "status": true, "userWorks": userWorks})
	}
}

func CreateWork() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		var requestData struct {
			Name       string   `json:"name" validate:"required"`
			Location   string   `json:"location" validate:"required"`
			CNO        int      `json:"cno" validate:"required"`
			StartDate  string   `json:"startDate,omitempty"`
			EndDate    string   `json:"endDate,omitempty"`
			IsActive   bool     `json:"isActive"`
			ManagerIDs []string `json:"managerIds,omitempty"`
		}

		if err := c.ShouldBindJSON(&requestData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		layout := "02/01/2006"
		var startDate, endDate time.Time
		var err error

		if requestData.StartDate != "" {
			startDate, err = time.Parse(layout, requestData.StartDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Formato inválido para startDate. Use dd/mm/yyyy",
					"status":  false,
				})
				return
			}
		}

		if requestData.EndDate != "" {
			endDate, err = time.Parse(layout, requestData.EndDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Formato inválido para endDate. Use dd/mm/yyyy",
					"status":  false,
				})
				return
			}
		}

		var managerIDs []primitive.ObjectID
		for _, managerIDStr := range requestData.ManagerIDs {
			managerID, err := primitive.ObjectIDFromHex(managerIDStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "ID de gerente inválido: " + managerIDStr,
					"status":  false,
				})
				return
			}
			managerIDs = append(managerIDs, managerID)
		}

		work := models.Work{
			Name:       requestData.Name,
			Location:   requestData.Location,
			CNO:        requestData.CNO,
			StartDate:  startDate,
			EndDate:    endDate,
			IsActive:   requestData.IsActive,
			ManagerIDs: managerIDs,
		}
		work.ID = primitive.NewObjectID()

		count, err := workCollection.CountDocuments(context.Background(), bson.M{"cno": work.CNO})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao verificar dados", "status": false})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"message": "Obra já cadastrada", "status": false})
			return
		}

		_, err = workCollection.InsertOne(context.Background(), work)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao salvar a obra", "status": false})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "Obra criada com sucesso",
			"status":  true,
			"work":    work,
		})
	}
}

func GetAllWorks() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		page := c.DefaultQuery("page", "1")
		limitStr := c.DefaultQuery("limit", "10")
		name := c.DefaultQuery("name", "")
		order := c.DefaultQuery("order", "true")
		active := c.DefaultQuery("active", "true")

		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit <= 0 {
			limit = 10
		}

		pageInt, err := strconv.Atoi(page)
		if err != nil || pageInt <= 0 {
			pageInt = 1
		}

		skip := (pageInt - 1) * limit

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		filter := bson.M{"isActive": active == "true"}
		if name != "" {
			filter["name"] = bson.M{"$regex": name, "$options": "i"}
		}

		sortOrder := 1
		if order == "false" {
			sortOrder = -1
		}
		sort := bson.M{"name": sortOrder}

		totalWorks, err := workCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao contar obras", "status": false})
			return
		}

		cursor, err := workCollection.Find(ctx, filter, options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)).SetSort(sort))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao obter obras", "status": false})
			return
		}
		defer cursor.Close(ctx)

		var works []models.Work
		if err := cursor.All(ctx, &works); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Obras listadas com sucesso",
			"works":   works,
			"pagination": gin.H{
				"totalWorks":  totalWorks,
				"totalPages":  (totalWorks + int64(limit) - 1) / int64(limit),
				"currentPage": pageInt,
			},
			"status": true,
		})
	}
}

func UpdateWork() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		workId := c.Param("workId")

		objctId, err := primitive.ObjectIDFromHex(workId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Função não encontrada", "status": false})
			return
		}

		var updateData bson.M

		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		filter := bson.M{"_id": objctId}
		update := bson.M{"$set": updateData}

		result, err := workCollection.UpdateOne(context.Background(), filter, update)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Obra não encontrada", "status": false})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Obra atualizada com sucesso", "status": true, "work": result})
	}
}

func DeleteWork() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		workId := c.Param("workId")

		objctId, err := primitive.ObjectIDFromHex(workId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Função não encontrada", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		_, err = workCollection.DeleteOne(ctx, bson.M{"_id": objctId})
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Obra não encontrada", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Obra excluída com sucesso", "status": true})
	}
}
