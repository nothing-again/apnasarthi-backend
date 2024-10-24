import { createDocument } from "../controllers/documentController.js";

const router = express.Router();

router.post("/", createDocument);

export default router;
