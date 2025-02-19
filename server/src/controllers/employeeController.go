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

var employeeCollection *mongo.Collection = database.OpenCollection(database.Client, "employees")

func GetEmployee() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		employeeID := c.Param("employeeId")
		objID, err := primitive.ObjectIDFromHex(employeeID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "ID inválido", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var employee models.Employee
		err = employeeCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&employee)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Funcionário não encontrado", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Funcionário encontrado", "employee": employee, "status": true})
	}
}

func CreateEmployee() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		var employee models.Employee
		if err := c.ShouldBindJSON(&employee); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		count, err := employeeCollection.CountDocuments(ctx, bson.M{"cpf": employee.CPF})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao verificar dados", "status": false})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"message": "Funcionário já cadastrado", "status": false})
			return
		}

		employee.ID = primitive.NewObjectID()
		employee.IsActive = true

		_, err = employeeCollection.InsertOne(ctx, employee)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao criar funcionário", "status": false})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Funcionário criado com sucesso", "status": true})
	}
}

func GetAllEmployees() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		page := c.DefaultQuery("page", "1")
		limitStr := c.DefaultQuery("limit", "10")
		name := c.DefaultQuery("name", "")
		active := c.DefaultQuery("active", "true") == "true"
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

		filter := bson.M{"isActive": active}
		if name != "" {
			filter["name"] = bson.M{"$regex": name, "$options": "i"}
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		totalEmployees, err := employeeCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao contar funcionários", "status": false})
			return
		}

		sortOrder := 1
		if !order {
			sortOrder = -1
		}
		sort := bson.M{"name": sortOrder}

		cursor, err := employeeCollection.Find(ctx, filter, options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)).SetSort(sort))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao obter funcionários", "status": false})
			return
		}
		defer cursor.Close(ctx)

		var employees []models.Employee
		for cursor.Next(ctx) {
			var employee models.Employee
			if err := cursor.Decode(&employee); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
				return
			}
			employees = append(employees, employee)
		}

		if err := cursor.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":   "Funcionários listados com sucesso",
			"employees": employees,
			"pagination": gin.H{
				"totalEmployees": totalEmployees,
				"totalPages":     (totalEmployees + int64(limit) - 1) / int64(limit),
				"currentPage":    pageInt,
			},
			"status": true,
		})
	}
}

func UpdateEmployee() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		employeeID := c.Param("employeeId")
		objctID, err := primitive.ObjectIDFromHex(employeeID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "ID inválido", "status": false})
			return
		}

		var updateData bson.M

		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		filter := bson.M{"_id": objctID}
		update := bson.M{"$set": updateData}

		result, err := employeeCollection.UpdateOne(context.Background(), filter, update)
		if err != nil || result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Funcionário não encontrado", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Funcionário atualizado com sucesso", "status": true})
	}
}

func DeleteEmployee() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		employeeID := c.Param("employeeId")
		objID, err := primitive.ObjectIDFromHex(employeeID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "ID inválido", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		result, err := employeeCollection.DeleteOne(ctx, bson.M{"_id": objID})
		if err != nil || result.DeletedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Funcionário não encontrado", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Funcionário excluído com sucesso", "status": true})
	}
}
