package routes

import (
	"controll/src/controllers"

	"github.com/gin-gonic/gin"
)

func EmployeeRoutes(router *gin.RouterGroup) {
	employee := router.Group("/api/employee")
	{
		employee.GET("/get-one/:employeeId", controllers.GetEmployee())
		employee.POST("/create", controllers.CreateEmployee())
		employee.GET("/get-all", controllers.GetAllEmployees())
		employee.PUT("/update/:employeeId", controllers.UpdateEmployee())
		employee.DELETE("/delete/:employeeId", controllers.DeleteEmployee())
	}
}
