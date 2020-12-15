import API from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'
import awsconfig from '../src/aws-exports'

API.configure(awsconfig)
PubSub.configure(awsconfig)
