package inventory

type Card interface {
	GetId() int
	GetName() string
	GetCardTypeId() int
	GetImageUrl() string
}
