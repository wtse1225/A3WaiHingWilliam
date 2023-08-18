interface Reservation {
    carType: 'sedan' | 'suv';
    date: Date;
    hour: number;
    childSeat: boolean;
}
export default Reservation;