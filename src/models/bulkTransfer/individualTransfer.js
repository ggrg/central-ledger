/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Georgi Georgiev <georgi.georgiev@modusbox.com>
 --------------
 ******/
'use strict'

const Db = require('../../lib/db')

const getAllById = async (id) => {
  try {
    const knex = await Db.getKnex()
    return await Db.bulkTransferAssociation.query(async (builder) => {
      let result = builder
        .leftJoin('transferFulfilment AS tf', 'tf.transferId', 'bulkTransferAssociation.transferId')
        .innerJoin(knex('transferStateChange AS tsc1')
          .select('tsc1.transferId')
          .max('tsc1.transferStateChangeId AS maxTransferStateChangeId')
          .innerJoin('bulkTransferAssociation AS bta1', 'bta1.transferId', 'tsc1.transferId')
          .where('bta1.bulkTransferId', id)
          .groupBy('tsc1.transferId').as('ts1'), 'ts1.transferId', 'bulkTransferAssociation.transferId'
        )
        .innerJoin('transferStateChange AS tsc', 'tsc.transferStateChangeId', 'ts1.maxTransferStateChangeId')
        .innerJoin('transferState AS ts', 'ts.transferStateId', 'tsc.transferStateId')
        .where({ 'bulkTransferAssociation.bulkTransferId': id })
        .select('bulkTransferAssociation.transferId', 'tf.ilpFulfilment AS fulfilment',
          'bulkTransferAssociation.errorCode', 'bulkTransferAssociation.errorDescription',
          'ts.enumeration AS transferStateEnum')
      return result
    })
  } catch (err) {
    throw err
  }
}

module.exports = {
  getAllById
}
