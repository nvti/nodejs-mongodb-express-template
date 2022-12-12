import config from "./config";
import * as firebase from "./services/firebase";
import * as database from "./services/database";

import { WebServer } from "./services/rest";

const webserver = new WebServer(config.port);

webserver.run();
