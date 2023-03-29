export type MongoDict = {
    [key: string]:
        | any
        | {
              [key: string]: any;
          };
};
