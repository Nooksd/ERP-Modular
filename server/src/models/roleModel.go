package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Role struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id" validate:"required"`
	Role       string             `bson:"role" json:"role" validate:"required"`
	Sector     string             `bson:"sector" json:"sector" validate:"required"`
	BaseSalary float64            `bson:"baseSalary" json:"baseSalary" validate:"required"`
	Additives  []string           `bson:"additives,omitempty" json:"additives,omitempty"`
	IsField    bool               `bson:"isField" json:"isField" validate:"required"`
}
