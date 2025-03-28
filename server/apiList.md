#API LIST

authRouter
 - POST /auth/signup
 - POST /auth/login
 - POST /auth/logout

profileRouter
 - GET /profile/view
 - PATCH /profile/edit
 - PATCH /profile/password

connectionReqRouter
 - POST /request/send/interested/:userId
 - POST /request/send/ignored/:userId
 - POST /request/review/accepted/:requestId
 - POST /request/review/rejected/:requestId

feedRouter
 - GET /connections
 - GET /requests/requested
 - GET /feed