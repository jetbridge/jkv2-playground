import {
  APIEvent,
  ApiView,
  ApiViewBase,
  BaseModel,
  Route,
  SubRoute,
} from "@jetkit/cdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Column, Entity } from "typeorm";

const commonOpts = {
  memorySize: 512,
  entry: __filename,
  bundling: {
    // target: "node14",
    minify: true,
    // sourceMap: true,
    target: "es2020",
    metafile: true,
    esbuildVersion: "0.11.14",
    logLevel: "debug",
  },
};

/**
 * Forum topic
 */
@Entity()
export class Topic extends BaseModel {
  @Column({ nullable: true })
  name: string;
}

@ApiView({
  path: "/topic",
  ...commonOpts,

  // handler: "TopicCrudApi.dispatch",
})
export class TopicCrudApi extends ApiViewBase {
  @SubRoute({ path: "/test" })
  async test() {
    return "Testerino";
  }

  post: APIGatewayProxyHandlerV2 = async () => "Posterino";
}

// handler function
export async function queryHandler(event: APIEvent) {
  return JSON.stringify({
    message: "function route",
    rawQueryString: event.rawQueryString,
  });
}
// define route & lambda
Route({
  path: "/blargle",
  ...commonOpts,
})(queryHandler);

export const handler: APIGatewayProxyHandlerV2 = async (event, context) =>
  new TopicCrudApi().dispatch(event, context);
