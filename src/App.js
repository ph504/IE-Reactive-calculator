import React from "react";

import Keypad from "./components/Keypad";
import Screen from "./components/Screen";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenText: "0",
      isAC: true,
      is1stOperand: true,
      afterOperator: false,
      isFloat: false,
      dupResult: 0, // this is the result when we don't enter any second operand.
      result: 0,    // this is the main result.
      secondOperand: "",
      operator: null,
      memory: Array(1).fill(0),
      mem_size: 1,
      //op_index: -1,
    };
  }

  handlePressDigit = (digit) => {
    // todo
    let operand2 = this.state.afterOperator ? this.state.secondOperand+digit.toString() : "";
    digit = this.state.isAC ? digit : this.state.screenText+digit.toString();    
    this.setState({
    	isAC: false,
    	secondOperand: operand2,
    	screenText: digit,
    	is1stOperand: !this.state.afterOperator, // the first operand is not(!) after the operator.
    })
  };

  handlePressOperator = (operator) => {
    // todo 
    // calculate results.            
    if(this.state.afterOperator && this.state.is1stOperand) { // for example: 6** 	
    	return;
    }
    else if(this.state.afterOperator && !this.state.is1stOperand) { // for example: 6*6*
    	let res = 0;
    	res = this.calculate();
    	this.setState({
    		screenText: res.toString()+operator,
        result: res,
    	});
    	
    }
    else { // for example: 6*
    	// change state.

      let res = parseFloat(this.state.screenText);   
	    this.setState({
	    	screenText: this.state.screenText+operator,
        result: res,
	    });
      
    }
    this.setState({
    	isAC: false,
    	afterOperator: true,
    	is1stOperand: true,
    	isFloat: false,    	
    	secondOperand: "0",	// previously was "".
    	operator: operator,
    });  
    
  };

  handlePressAC = () => {
    // done
    this.setState({
    	secondOperand: "0",
    	screenText: "0",
    	isAC: true,
    	is1stOperand: true,
    	afterOperator: false,
    	isFloat: false,
    	dupResult: 0,
    	result: 0,
    	operator: null,
    });

  };

  handlePressDot = () => {
    // done
    let txt = this.state.isFloat ? this.state.screenText : this.state.screenText+".";
    let operand2 = this.state.isFloat ? this.state.secondOperand : this.state.secondOperand+".";
    this.setState({
    	secondOperand: operand2,
    	screenText: txt,
    	isAC: false,
    	is1stOperand: false,
    	isFloat: true,
    });

  };

  handlePressNegator = () => {
    // todo
    //let neg = this.state.screenText.includes('-')?this.state.screenText.substring(1,this.state.state.screenText.length):"-"+this.state.screenText;
    let neg = '-'.includes(this.state.screenText[0])?this.state.screenText.toString().substr(1):"-"+this.state.screenText;

    this.setState({
      result: -this.state.result,
      screenText: neg,
    });
  };

  handlePressResult = () => {
    // todo
    let isFLOAT = String(this.state.screenText).includes(".");
    let res = this.calculate();
    if(!this.state.afterOperator) {
      return;
    }
    if(this.state.afterOperator && this.state.is1stOperand) {
      //res = this.state.dupResult.toString();
      res = this.calculate_dup();
    }
    
    this.setState({
    	isAC: true,
      screenText: res,
      operator: null,
      afterOperator: false,
      isFloat: isFLOAT,      
    });

  };

  calculate = () => {
    let res = 0;
  	switch(this.state.operator) {
  		case "+": 
        res = (this.state.result+this.state.result);
  			this.setState({dupResult: res,});
  			return (this.state.result+parseFloat(this.state.secondOperand)).toString();

  		case "-": 
        res = (this.state.result-this.state.result);
  			this.setState({dupResult: res,});
  			return (this.state.result-parseFloat(this.state.secondOperand)).toString();

  		case "*":        
        res = (this.state.result*this.state.result);
  			this.setState({dupResult: res,});
  			return (this.state.result*parseFloat(this.state.secondOperand)).toString();

  		case "/": 
        res = (this.state.result/this.state.result);
  			this.setState({dupResult: res,});
  			return (this.state.result/parseFloat(this.state.secondOperand)).toString();

  		case "%": 
        res = (this.state.result%this.state.result);
  			this.setState({dupResult: res,});
  			return (this.state.result%parseFloat(this.state.secondOperand)).toString();

  		case null: 
  			return this.state.result.toString();
    }    
  };

  calculate_dup = () => {
    let res = 0;
    switch(this.state.operator) {
      case "+": 
        res = (this.state.result+this.state.result);
        this.setState({dupResult: res,});
        return res.toString();

      case "-": 
        res = (this.state.result-this.state.result);
        this.setState({dupResult: res,});
        return res.toString();

      case "*":        
        res = (this.state.result*this.state.result);
        this.setState({dupResult: res,});
        return res.toString();

      case "/": 
        res = (this.state.result/this.state.result);
        this.setState({dupResult: res,});
        return res.toString();

      case "%": 
        res = (this.state.result%this.state.result);
        this.setState({dupResult: res,});
        return res.toString();

      case null: 
        return this.state.result.toString();
    }
  };


  handlePressMCLR = () => {
    let i;
    const memory = this.state.memory.slice();
    for(i=0; i < memory.length; ++i){
      memory[i] = 0;
    }
    this.setState({memory: memory});
  };

  handlePressMREC = () => {
    if(this.state.afterOperator && this.state.is1stOperand) { // for example: 6*__  
      this.setState({
        screenText: this.state.screenText+this.state.memory[this.state.memory.length-1],
        secondOperand: this.state.memory[this.state.memory.length-1],

      });
    }
    else if(this.state.afterOperator && !this.state.is1stOperand) { // for example: 6*6
      this.setState({          
        screenText: String(this.state.screenText).substr(0,String(this.state.screenText).indexOf(this.state.operator)+1)+this.state.memory[this.state.memory.length-1],
        secondOperand: this.state.memory[this.state.memory.length-1],
      });
    }
    else { // for example: 6_ __
      this.setState({
        screenText: this.state.memory[this.state.memory.length-1],
        result: this.state.memory[this.state.memory.length-1],

      });
    }
  };

  handlePressMADD = () => {
    const memory = this.state.memory;
    if(this.state.afterOperator && this.state.is1stOperand) { // for example: 6*__, 6 is subtracted from memory.
      memory[memory.length-1] = this.state.memory[this.state.memory.length-1] + this.state.result
    }
    else if(this.state.afterOperator && !this.state.is1stOperand) { // for example: 6*7, 7 is subtracted from memory.
      memory[memory.length-1] = this.state.memory[this.state.memory.length-1] + parseFloat(this.state.secondOperand);      
    }
    else{ // for example: 6_ __, 6 is subtracted from memory.
      memory[memory.length-1] = this.state.memory[this.state.memory.length-1] + parseFloat(this.state.screenText);
    }

    this.setState({memory: memory});
  };

  handlePressMSUB = () => {
    const memory = this.state.memory;
    if(this.state.afterOperator && this.state.is1stOperand) { // for example: 6*__, 6 is subtracted from memory.
      memory[memory.length-1] = this.state.memory[this.state.memory.length-1] - this.state.result
    }
    else if(this.state.afterOperator && !this.state.is1stOperand) { // for example: 6*7, 7 is subtracted from memory.
      memory[memory.length-1] = this.state.memory[this.state.memory.length-1] - parseFloat(this.state.secondOperand);      
    }
    else{ // for example: 6_ __, 6 is subtracted from memory.
      memory[memory.length-1] = this.state.memory[this.state.memory.length-1] - parseFloat(this.state.screenText);
    }

    this.setState({memory: memory});
  };

  handlePressMSTR = () => {
    const memory = this.state.memory;
    if(this.state.afterOperator && this.state.is1stOperand) { // for example: 6*__, 6 is stored
      memory[memory.length] = this.state.result
    }
    else if(this.state.afterOperator && !this.state.is1stOperand) { // for example: 6*7, 7 is stored.
      memory[memory.length] = parseFloat(this.state.secondOperand);      
    }
    else{ // for example: 6_ __, 6 is stored.
      memory[memory.length] = parseFloat(this.state.screenText);
    }

    this.setState({memory: memory});
    
  };

  render() {
    return (
      <div>
        <Screen text={this.state.screenText+", Memory = {"+this.state.memory.toString()+"}"} />
        <Keypad
        // add on pressed mem.
          onPressMCLR={this.handlePressMCLR} // memory clear
          onPressMREC={this.handlePressMREC} // memory recall
          onPressMADD={this.handlePressMADD} // memory add
          onPressMSUB={this.handlePressMSUB} // memory subtract
          onPressMSTR={this.handlePressMSTR} // memory store
          onPressDigit={this.handlePressDigit}
          onPressOperator={this.handlePressOperator}
          onPressAC={this.handlePressAC}
          onPressDot={this.handlePressDot}
          onPressNegator={this.handlePressNegator}
          onPressResult={this.handlePressResult}
        />
      </div>
    );
  }
}

export default App;
