
// declare function require(ids: string | Array<string>, callback?: Function): any;

declare function fetch(url: string): Function;

declare module CSSModule {
  declare var exports: { [key: string]: string };
}

declare module AssetModule {
  declare var exports: { [key: string]: string };
}

declare module FileModule {
  declare var exports: { [key: string]: string };
}

declare module AppModule {
  declare var exports: Any;
}
