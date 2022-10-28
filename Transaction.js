class Transaction{
    constructor(payer, points, timestamp) {
      this.payer = payer;
      this.points = points;
      this.timestamp = timestamp
    }

    setPayer(payer){
        this.payer = payer;
    }
    getPayer(){
        return this.payer;
    }

    setPoints(points){
        this.points = points;
    }
    getPoints(){
        return this.points;
    }

    setTimestamp(timestamp){
        this.timestamp = timestamp;
    }
    getTimestamp(){
        return this.timestamp;
    }


      
  }

  module.exports = Transaction