// Add global type declarations here
declare namespace NodeJS {
  interface Global {
    ActiveXObject: any;
  }
}

declare var ActiveXObject: {
  new (type: string): any;
};
