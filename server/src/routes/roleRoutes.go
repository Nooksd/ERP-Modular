package routes

import (
	"controll/src/controllers"

	"github.com/gin-gonic/gin"
)

func RoleRoutes(router *gin.RouterGroup) {
	role := router.Group("/api/role")
	{
		role.POST("/create", controllers.CreateRole())
		role.GET("/get-all-field-roles", controllers.GetAllFieldRoles())
		role.GET("/get-all", controllers.GetAllRoles())
		role.GET("/get-one/:roleId", controllers.GetRole())
		role.PUT("/update/:roleId", controllers.UpdateRole())
	}
}
