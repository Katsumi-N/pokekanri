package inventory

type Inventory struct {
	id       int
	card     Card
	quantity int
}

func NewInventory(id int, card Card, quantity int) *Inventory {
	return &Inventory{
		id:       id,
		card:     card,
		quantity: quantity,
	}
}

func (i *Inventory) GetID() int {
	return i.id
}

func (i *Inventory) GetCard() Card {
	return i.card
}

func (i *Inventory) GetQuantity() int {
	return i.quantity
}

func (i *Inventory) SetQuantity(quantity int) {
	i.quantity = quantity
}
