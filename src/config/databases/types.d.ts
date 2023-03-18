export type Filter = {
    [key: string]:
        | any
        | {
              [key: string]: any;
          };
};
