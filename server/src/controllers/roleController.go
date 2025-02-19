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
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var roleCollection *mongo.Collection = database.OpenCollection(database.Client, "roles")

func CreateRole() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, "Administrativo"); !ok {
			return
		}

		var role models.Role

		if err := c.ShouldBindJSON(&role); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		if role.Role == "" || role.Sector == "" || role.BaseSalary == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Todos os campos são obrigatórios", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		count, err := roleCollection.CountDocuments(ctx, bson.M{"role": role.Role})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao verificar dados", "status": false})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"message": "Função já cadastrada", "status": false})
			return
		}

		role.ID = primitive.NewObjectID()
		_, err = roleCollection.InsertOne(ctx, role)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao salvar a função", "status": false})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Função criada com sucesso", "status": true, "role": role})
	}
}

func GetRole() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, "Administrativo"); !ok {
			return
		}

		roleId := c.Param("roleId")

		objctId, err := primitive.ObjectIDFromHex(roleId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Função não encontrada", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var role models.Role
		err = roleCollection.FindOne(ctx, bson.M{"_id": objctId}).Decode(&role)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Função não encontrada", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Função encontrada com sucesso", "role": role, "status": true})
	}
}

func UpdateRole() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, "Administrativo"); !ok {
			return
		}

		roleId := c.Param("roleId")

		objctId, err := primitive.ObjectIDFromHex(roleId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Função não encontrada", "status": false})
			return
		}

		var role models.Role

		if err := c.ShouldBindJSON(&role); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		if role.Role == "" && role.Sector == "" && role.BaseSalary == 0 && !role.IsField && role.Additives == nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Nenhum dado para atualizar", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		updateData := bson.M{}
		if role.Role != "" {
			updateData["role"] = role.Role
		}
		if role.Sector != "" {
			updateData["sector"] = role.Sector
		}
		if role.BaseSalary != 0 {
			updateData["baseSalary"] = role.BaseSalary
		}
		if role.Additives != nil {
			updateData["additives"] = role.Additives
		}

		_, err = roleCollection.UpdateOne(
			ctx,
			bson.M{"_id": objctId},
			bson.M{"$set": updateData},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao atualizar função", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Função atualizada com sucesso", "status": true})
	}
}

func GetAllRoles() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, "Administrativo"); !ok {
			return
		}

		page := c.DefaultQuery("page", "1")
		limitStr := c.DefaultQuery("limit", "10")
		order := c.DefaultQuery("order", "true") == "true"

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

		sortOrder := 1
		if !order {
			sortOrder = -1
		}
		sort := bson.M{"name": sortOrder}

		filter := bson.M{}

		cursor, err := roleCollection.Find(ctx, filter, options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)).SetSort(sort))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao obter funções", "status": false})
			return
		}
		defer cursor.Close(ctx)

		var roles []models.Role
		for cursor.Next(ctx) {
			var role models.Role
			err := cursor.Decode(&role)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
				return
			}
			roles = append(roles, role)
		}

		if err := cursor.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Funções encontradas com sucesso",
			"roles":   roles,
			"pagination": gin.H{
				"totalRoles":  len(roles),
				"totalPages":  (int64(len(roles)) + int64(limit) - 1) / int64(limit),
				"currentPage": pageInt,
			},
			"status": true,
		})
	}
}

func GetAllFieldRoles() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		cursor, err := roleCollection.Find(ctx, bson.M{"isField": true})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao obter funções de campo", "status": false})
			return
		}
		defer cursor.Close(ctx)

		var roles []models.Role

		for cursor.Next(ctx) {
			var role models.Role
			err := cursor.Decode(&role)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
				return
			}
			roles = append(roles, role)
		}

		if len(roles) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Sem funções de campo", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Funções de campo encontradas com sucesso",
			"status":  true,
			"roles":   roles,
		})
	}
}
