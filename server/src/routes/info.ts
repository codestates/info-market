import express from 'express';
const router = express.Router();
const infoControllers = require('../controlloers/info');
const replyControllers = require('../controlloers/reply');
const orderControllers = require('../controlloers/order');
const auth = require('../middlewares/auth');

// 게시물 info.js
router.get('/:infoId', auth.me, infoControllers.getInfo);
router.post('/', auth.me, infoControllers.writeInfo);
router.delete('/:infoId', auth.me, infoControllers.removeInfo);
router.put('/:infoId', auth.me, infoControllers.putInfo);
router.get('/', infoControllers.getInfoes);

// 댓글 reply.js
router.post('/:infoId/reply', auth.me, replyControllers.writeReply);
router.put('/:infoId/reply/:replyId', auth.me, replyControllers.putReply);
router.delete('/:infoId/reply/:replyId', auth.me, replyControllers.removeReply);

// 게시물 구매 order.js
router.post('/:infoId/order', orderControllers.orderInfo);
router.delete('/:infoId/refund', orderControllers.refundInfo);

module.exports = router;
