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

var activityCollection *mongo.Collection = database.OpenCollection(database.Client, "activities")

func CreateActivity() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		var activity models.Activity

		if err := c.ShouldBindJSON(&activity); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		count, err := activityCollection.CountDocuments(ctx, bson.M{"area": activity.Area})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao verificar dados", "status": false})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"message": "Atividade já cadastrada", "status": false})
			return
		}

		activity.ID = primitive.NewObjectID()
		_, err = activityCollection.InsertOne(ctx, activity)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao criar atividade", "status": false})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Atividade criada com sucesso", "status": true})
	}
}

func GetAllActivities() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		pageStr := c.DefaultQuery("page", "1")
		limitStr := c.DefaultQuery("limit", "10")
		name := c.DefaultQuery("name", "")
		order := c.DefaultQuery("order", "true") == "true"

		page, err := strconv.Atoi(pageStr)
		if err != nil || page <= 0 {
			page = 1
		}

		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit <= 0 {
			limit = 10
		}

		filter := bson.M{}
		if name != "" {
			filter["area"] = bson.M{"$regex": name, "$options": "i"}
		}

		sortOrder := 1
		if !order {
			sortOrder = -1
		}

		sort := bson.M{"area": sortOrder}

		skip := (page - 1) * limit

		cursor, err := activityCollection.Find(
			context.Background(),
			filter,
			options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)).SetSort(sort),
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao obter atividades", "status": false})
			return
		}
		defer cursor.Close(context.Background())

		var activities []models.Activity

		for cursor.Next(context.Background()) {
			var activity models.Activity
			if err := cursor.Decode(&activity); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
				return
			}
			activities = append(activities, activity)
		}

		if err := cursor.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":    "Atividades listadas com sucesso",
			"activities": activities,
			"pagination": gin.H{
				"totalActivities": len(activities),
				"totalPages":      (len(activities) + limit - 1) / limit,
				"currentPage":     page,
			},
			"status": true,
		})
	}
}

func GetActivity() gin.HandlerFunc {
	return func(c *gin.Context) {
		var userPages []string
		if ok, _, pages := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		} else {
			userPages = pages
		}

		if !contains(userPages, "Administrativo") {
			c.JSON(http.StatusForbidden, gin.H{"message": "Sem permissão", "status": false})
			return
		}

		activityID := c.Param("activityId")

		objID, err := primitive.ObjectIDFromHex(activityID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "ID inválido", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var activity models.Activity

		err = activityCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&activity)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Atividade não encontrada", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Atividade encontrada", "activity": activity, "status": true})
	}
}

func UpdateActivity() gin.HandlerFunc {
	return func(c *gin.Context) {

		var userPages []string
		if ok, _, pages := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		} else {
			userPages = pages
		}

		if !contains(userPages, "Administrativo") {
			c.JSON(http.StatusForbidden, gin.H{"message": "Sem permissão", "status": false})
			return
		}

		activityID := c.Param("activityId")
		objID, err := primitive.ObjectIDFromHex(activityID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "ID inválido", "status": false})
			return
		}

		var updateData models.Activity
		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		update := bson.M{}
		if updateData.Area != "" {
			update["area"] = updateData.Area
		}
		if updateData.Activities != nil {
			update["activities"] = updateData.Activities
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		result, err := activityCollection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": update})
		if err != nil || result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Atividade não encontrada", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Atividade atualizada com sucesso", "status": true})
	}
}

func DeleteActivity() gin.HandlerFunc {
	return func(c *gin.Context) {

		var userPages []string
		if ok, _, pages := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		} else {
			userPages = pages
		}

		if !contains(userPages, "Administrativo") {
			c.JSON(http.StatusForbidden, gin.H{"message": "Sem permissão", "status": false})
			return
		}

		activityID := c.Param("activityId")
		objID, err := primitive.ObjectIDFromHex(activityID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "ID inválido", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		result, err := activityCollection.DeleteOne(ctx, bson.M{"_id": objID})
		if err != nil || result.DeletedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Atividade não encontrada", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Atividade excluída com sucesso", "status": true})
	}
}

func contains(arr []string, str string) bool {
	for _, v := range arr {
		if v == str {
			return true
		}
	}
	return false
}
