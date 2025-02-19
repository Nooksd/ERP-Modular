package controllers

import (
	"context"
	"log"
	"net/http"
	"strconv"

	helper "controll/src/helpers"
	"controll/src/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var validate = validator.New()

func HashPassword(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		log.Panic(err)
		return ""
	}
	return string(hashedPassword)
}

func CreateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		var user models.User

		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Todos os campos são obrigatórios", "status": false})
			return
		}

		if len(user.Password) < 5 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "senha muito curta", "len": len(user.Password)})
			return
		}

		count, err := userCollection.CountDocuments(context.Background(), bson.M{"email": user.Email})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao verificar dados", "status": false})
			return
		}
		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"message": "Usuário já cadastrado", "status": false})
			return
		}

		hashedPassword := HashPassword(user.Password)
		user.Password = hashedPassword
		user.Avatar = "https://relevium.com.br/wp-content/uploads/2015/09/default-avatar-300x300.png"
		user.ID = primitive.NewObjectID()
		user.IsActive = true

		validationErrors := validate.Struct(user)
		if validationErrors != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErrors.Error()})
			return
		}

		_, err = userCollection.InsertOne(context.Background(), user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao criar o usuário", "status": false})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Usuário criado com sucesso", "status": true, "user": user})
	}
}

func UpdateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		targetUserId := c.Param("userId")

		if ok, _, _ := helper.CheckAdminOrUidPermission(c, targetUserId); !ok {
			return
		}

		var userUpdates bson.M

		if err := c.BindJSON(&userUpdates); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao ler os dados de atualização"})
			return
		}

		if password, exists := userUpdates["password"].(string); exists {
			if len(password) < 5 {
				delete(userUpdates, "password")
			} else {
				userUpdates["password"] = HashPassword(password)
			}
		}

		objctId, err := primitive.ObjectIDFromHex(targetUserId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
			return
		}

		filter := bson.M{"_id": objctId}
		update := bson.M{"$set": userUpdates}

		result, err := userCollection.UpdateOne(context.Background(), filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar os dados do usuário"})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
			return
		}

		var userProfile models.User

		err = userCollection.FindOne(context.Background(), filter).Decode(&userProfile)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar o usuário atualizado"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Usuário atualizado com sucesso",
			"result":  result,
			"user":    userProfile,
		})
	}
}

func GetProfile() gin.HandlerFunc {
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

		objctId, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Usuário não encontrado", "status": false})
			return
		}

		var user models.User

		err = userCollection.FindOne(context.Background(), bson.M{"_id": objctId}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Usuário não encontrado", "status": false})
			return
		}

		user.Password = ""

		c.JSON(http.StatusOK, gin.H{"message": "Perfil do usuário encontrado com sucesso", "user": user, "status": true})
	}
}

func GetUserById() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		userId := c.Param("userId")

		objctId, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Usuário não encontrado", "status": false})
			return
		}

		var user models.User

		err = userCollection.FindOne(context.Background(), bson.M{"_id": objctId}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Usuário não encontrado", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Usuário encontrado com sucesso", "user": user, "status": true})
	}
}

func DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		userId := c.Param("userId")

		objctId, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Usuário não encontrado", "status": false})
			return
		}

		_, err = userCollection.DeleteOne(context.Background(), bson.M{"_id": objctId})
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Usuário não encontrado", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Usuário excluído com sucesso", "status": true})
	}
}

func GetAllUsers() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		pageStr := c.DefaultQuery("page", "1")
		limitStr := c.DefaultQuery("limit", "10")
		name := c.DefaultQuery("name", "")
		order := c.DefaultQuery("order", "true") == "true"
		active := c.DefaultQuery("active", "true") == "true"

		page, err := strconv.Atoi(pageStr)
		if err != nil || page <= 0 {
			page = 1
		}

		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit <= 0 {
			limit = 10
		}

		filter := bson.M{"isActive": active}
		if name != "" {
			filter["name"] = bson.M{"$regex": name, "$options": "i"}
		}

		sortOrder := 1
		if !order {
			sortOrder = -1
		}

		sort := bson.M{"name": sortOrder}

		skip := (page - 1) * limit

		cursor, err := userCollection.Find(
			context.Background(),
			filter,
			options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)).SetSort(sort),
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao listar usuários", "status": false})
			return
		}
		defer cursor.Close(context.Background())

		var users []models.User
		if err := cursor.All(context.Background(), &users); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao mapear os usuários", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Usuários listados com sucesso",
			"users":   users,
			"pagination": gin.H{
				"totalUsers":  len(users),
				"totalPages":  (len(users) + limit - 1) / limit,
				"currentPage": page,
			},
			"status": true,
		})
	}
}

func GetManagers() gin.HandlerFunc {
	return func(c *gin.Context) {
		if ok, _, _ := helper.CheckAdminOrUidPermission(c, ""); !ok {
			return
		}

		filter := bson.M{"isManager": true}

		cursor, err := userCollection.Find(context.Background(), filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao buscar gerentes", "status": false})
			return
		}

		var managers []models.User
		if err := cursor.All(context.Background(), &managers); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao mapear os gerentes", "status": false})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":    "Lista de gerentes recuperada com sucesso",
			"status":     true,
			"managerIds": managers,
		})
	}
}
