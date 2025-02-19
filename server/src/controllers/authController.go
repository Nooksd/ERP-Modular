package controllers

import (
	"context"
	database "controll/src/db"
	"controll/src/models"
	"fmt"
	"net/http"
	"os"
	"time"

	helper "controll/src/helpers"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = database.OpenCollection(database.Client, "users")

func VerifyPassword(providedPassword string, storedHash string) error {
	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(providedPassword))
	if err != nil {
		return fmt.Errorf("email ou senha incorretos")
	}
	return nil
}

func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var loginData struct {
			Email        string `json:"email"`
			Password     string `json:"password"`
			KeepLoggedIn bool   `json:"keepConnection"`
		}

		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Todos os campos são obrigatórios", "status": false})
			return
		}

		var user models.User

		err := userCollection.FindOne(context.Background(), bson.M{"email": loginData.Email}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Email ou senha inválidos 1", "status": false})
			return
		}

		err = VerifyPassword(loginData.Password, user.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Email ou senha inválidos 2", "status": false})
			return
		}

		accessToken, refreshToken, _ := helper.GenerateTokens(user.ID.Hex(), user.IsManager, user.Pages, loginData.KeepLoggedIn)

		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "accessToken",
			Value:    accessToken,
			Path:     "/",
			Domain:   "controll-api.innova-energy.com.br",
			Expires:  time.Now().Add(24 * time.Hour),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		})

		if loginData.KeepLoggedIn {
			http.SetCookie(c.Writer, &http.Cookie{
				Name:     "refreshToken",
				Value:    refreshToken,
				Path:     "/",
				Domain:   "controll-api.innova-energy.com.br",
				Expires:  time.Now().Add(7 * 24 * time.Hour),
				HttpOnly: true,
				Secure:   true,
				SameSite: http.SameSiteNoneMode,
			})
		}

		c.JSON(http.StatusOK, gin.H{"message": "Autenticado com sucesso", "user": user, "status": true})
	}
}

func Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "accessToken",
			Value:    "",
			Path:     "/",
			Domain:   "controll-api.innova-energy.com.br",
			Expires:  time.Now(),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		})

		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "refreshToken",
			Value:    "",
			Path:     "/",
			Domain:   "controll-api.innova-energy.com.br",
			Expires:  time.Now(),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		})

		c.JSON(http.StatusOK, gin.H{"message": "Sessão encerrada com sucesso", "status": true})
	}
}

func RefreshToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		refreshToken, _ := c.Cookie("refreshToken")
		if refreshToken == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Token não fornecido"})
			return
		}

		token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("SECRET_KEY")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Token inválido"})
			return
		}

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
		isManager := claims["IsManager"].(bool)

		var pages []string
		if rawPages, ok := claims["Pages"].([]interface{}); ok {
			for _, page := range rawPages {
				if str, ok := page.(string); ok {
					pages = append(pages, str)
				}
			}
		}

		newAccessToken, _, err := helper.GenerateTokens(userId, isManager, pages, false)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar novo token"})
			return
		}

		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "accessToken",
			Value:    newAccessToken,
			Path:     "/",
			Domain:   "controll-api.innova-energy.com.br",
			Expires:  time.Now().Add(24 * time.Hour),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		})

		c.JSON(http.StatusOK, gin.H{
			"accessToken": newAccessToken,
		})
	}
}
