package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Employee struct {
	ID         primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Name       string               `bson:"name" json:"name" validate:"required"`
	CPF        string               `bson:"cpf" json:"cpf" validate:"required"`
	Email      string               `bson:"email,omitempty" json:"email,omitempty" validate:"required"`
	Role       string               `bson:"role" json:"role" validate:"required"`
	StartDate  time.Time            `bson:"startDate,omitempty" json:"startDate,omitempty" validate:"required"`
	IsActive   bool                 `bson:"isActive" json:"isActive" validate:"required"`
	ManagerIDs []primitive.ObjectID `bson:"managerIds,omitempty" json:"managerIds,omitempty"`
}
