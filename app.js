require('dotenv').config();
const Express = require('express');
const app = Express();
const port = process.env.PORT;

const cors = require ('cors');

// cors allow
app.use(cors({
  origin: '*',
  method: '*',
  allowedHeaders: '*'
}));


const MongoManager = require('./src/shared/db/mongodb/mongo-manager')
const MiddleWare = require('./src/shared/middleware/base-middleware');
const HealthRoutes = require('./src/routes/health.routes');
const AdminRoutes = require('./src/routes/admin.routes');
const PublicRoutes = require('./src/routes/public.routes');
const AgentRoutes = require('./src/routes/agent.routes')
const regionRouter = require('./src/routes/region.routes')
const MessageRouter = require('./src/routes/message.routes')


app.use(Express.static('./src/public')) //serves our static genesis project
app.use(Express.json())


MiddleWare.registerBaseMiddleWare(app)
HealthRoutes.registerHealthRoutes(app);
AdminRoutes.registerAdminRoutes(app);
PublicRoutes.registerPublicRoutes(app);
AgentRoutes.registerAgentRoutes(app);
regionRouter.registerRegionRoutes(app);
MessageRouter.messageRoutes(app);


MongoManager.openMongoConnection();
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
