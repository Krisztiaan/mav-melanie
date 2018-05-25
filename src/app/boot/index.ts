import config from "./configureStore";
import app from "./setup";

export default function() {
  const stores = config();
  console.log(stores)
	return app(stores);
}
