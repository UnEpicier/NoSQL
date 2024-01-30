#!/bin/bash

set -e

mongosh <<EOF
use admin
db.createUser({
  user: 'user',
  pwd:  'secret',
  roles: [{
    role: 'readWrite',
    db: 'admin'
  }]
})
EOF