package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Page struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title  string             `bson:"title" json:"title" validate:"required"`
	Path   string             `bson:"path" json:"path" validate:"required"`
	Author primitive.ObjectID `bson:"author" json:"author" validate:"required"`
}
