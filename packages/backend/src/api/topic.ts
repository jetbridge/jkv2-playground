import { APIEvent, ApiView, ApiViewBase, Route, SubRoute } from "@jetkit/cdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { BaseModel } from "demo-repo";
import { Column, Entity } from "typeorm";

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
  memorySize: 512,
  bundling: {
    minify: true,
    sourceMap: true,
    metafile: true,
    esbuildVersion: "0.11.14",
  },
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
  memorySize: 1024,
  bundling: { minify: true, sourceMap: true },
})(queryHandler);

export const handler: APIGatewayProxyHandlerV2 = async (event, context) =>
  new TopicCrudApi().dispatch(event, context);
