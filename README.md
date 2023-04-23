# CONTROLLERS

## Chat

    - [ ] GET /chat/suggest 	# return all chats from telegram account
    - [ ] GET /chat 		    # return all listening chats
    - [ ] POST /chat 		    # add chat to listening
    - [ ] DELETE /chat/:id 	    # remove chat from listening

## Webhook

    - [ ] GET /webhook 		    # return 200 or 404 which describes is current team is use webhook
    - [ ] POST /webhook		    # add current team to webhook
    - [ ] DELETE /webhook	    # remove current team from webhook

## Publish

    - [ ] POST /publish/:id	    # publish data to selected chat

# MODELS

## Chat

    - [ ] Id				    # int
    - [ ] ReferenceId			# bigint
    - [ ] Tags			        # string[]

## Webhook

    - [ ] TeamId		        # int
    - [ ] ResourceURL		    # string
    - [ ] Retries			    # int (default=0)

# CLIENT API

## Webhook event

    - [ ] ChatId			    # int
    - [ ] ChatTags			    # string[]
    - [ ] Payload
    	- [ ] OriginalText	    # string
    	- [ ] TranslatedText	# string
    	- [ ] Media		        # binary[]
