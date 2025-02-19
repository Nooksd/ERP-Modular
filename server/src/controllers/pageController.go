package controllers

import (
	"context"
	"net/http"
	"time"

	database "controll/src/db"
	helper "controll/src/helpers"
	"controll/src/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var pageCollection *mongo.Collection = database.OpenCollection(database.Client, "pages")

func CreatePage() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		var page models.Page
		if err := c.ShouldBindJSON(&page); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inválidos", "status": false})
			return
		}

		if page.Title == "" || page.Path == "" {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Todos campos são obrigatórios", "status": false})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		count, err := pageCollection.CountDocuments(ctx, bson.M{"path": page.Path})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao verificar dados", "status": false})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"message": "Página já cadastrada", "status": false})
			return
		}

		page.ID = primitive.NewObjectID()
		page.Author = c.MustGet("user").(models.User).ID
		_, err = pageCollection.InsertOne(ctx, page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao salvar a página", "status": false})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Página criada com sucesso", "status": true, "page": page})
	}
}

func GetAllPages() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		cursor, err := pageCollection.Find(ctx, bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao obter páginas", "status": false})
			return
		}
		defer cursor.Close(ctx)

		var pages []models.Page
		if err := cursor.All(ctx, &pages); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao processar dados", "status": false})
			return
		}

		if len(pages) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Sem páginas encontradas", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Páginas encontradas com sucesso", "status": true, "pages": pages})
	}
}
