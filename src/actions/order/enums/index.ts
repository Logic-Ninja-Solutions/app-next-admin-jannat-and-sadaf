export enum OrderActionType {
  fetchOrders = 'fetchOrders',
  getOrder = 'getOrder',
  updateStatus = 'updateStatus',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
