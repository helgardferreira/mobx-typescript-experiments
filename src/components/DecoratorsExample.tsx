import { Component } from "react";

function first() {
  console.log("first(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called");
    console.log({
      target,
      propertyKey,
      descriptor,
    });
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called");
    console.log({
      target,
      propertyKey,
      descriptor,
    });
  };
}

function classDecoratorFactory() {
  console.log("classDecorator(): factory evaluated");
  return function (classArg: any) {
    console.log("classDecorator(): called");
    console.log(classArg);
  };
}

@classDecoratorFactory()
export default class DecoratorsExample extends Component {
  @first()
  @second()
  method() {
    console.log("method called");
  }

  render() {
    this.method();

    return <div></div>;
  }
}
