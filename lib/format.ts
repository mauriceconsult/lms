export const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
    }).format(Number(amount))
}
