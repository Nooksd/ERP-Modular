package helpers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func CheckAdminOrUidPermission(c *gin.Context, targetUid string) (bool, string, []string) {
	userClaims, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return false, "", nil
	}

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar token"})
		return false, "", nil
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

	if isManager || userId == targetUid {
		return true, userId, pages
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Você não tem permissão para acessar este recurso"})
	return false, "", nil
}
