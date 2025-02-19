package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID         primitive.ObjectID `bson:"_id" json:"id"`
	Name       string             `bson:"name" json:"name" validate:"required"`
	EmployeeID primitive.ObjectID `bson:"employeeId" json:"employeeId" validate:"required"`
	Email      string             `bson:"email" json:"email" validate:"required"`
	Password   string             `bson:"password" json:"password" validate:"required"`
	Avatar     string             `bson:"avatar" json:"avatar"`
	IsManager  bool               `bson:"isManager" json:"isManager" validate:"required"`
	IsActive   bool               `bson:"isActive" json:"isActive"`
	Pages      []string           `bson:"pages" json:"pages"`
}
