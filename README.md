# TODO

## Primary
- [ ] Webhook subscription to events for external services
    - [x] Register new webhook subscription
    - [x] Check is external service has active subscription
    - [x] Auto-unsubscribe/remove webhook is reached over 5 retries when sending data to external service
    - [ ] Send data to external service using registered webhook
- [ ] Channels
    - [ ] Get available channels for listening
    - [ ] Add channel to listening from available list
    - [ ] Remove channel from listening
    - [ ] Rename listening channel
    - [ ] Send data to selected listened channel

## Secondary
- [ ] Make this service available only in whitelist origins
- [ ] Min/Max RAM and CPU usage
- [ ] Connect our logger to any cloud logger system

## Backlog
- [ ] Optimize next media if its possible
    - [ ] Video (webp, mp4)
    - [ ] Image (webp, jpeg, png, gif)
    - [ ] Audio (webp, mp3, acc)
