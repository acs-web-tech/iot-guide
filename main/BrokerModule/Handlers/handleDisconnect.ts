export async function processDisconnect(cliendID, socket, clean) {
  let index = 0
    console.log("dis",clean)
  if (clean != 0) {
  
    let subscriptions = this.connection[cliendID.toString()]?.subscriptions
    console.log("14", subscriptions, this.connection)

    for (let topic of subscriptions) {
      delete this.subscription?.[topic]?.[cliendID.toString()]
    }
    delete this.pendingQueue?.[cliendID]
    delete this.connection[cliendID.toString()]
    //  let removePending = await deleteDataByClientID(dbconnection.inMemory,
    //       [
    //            cliendID
    //       ],
    //       "qos_2_pending_list"
    //  )
    //  let removeRetainMessage = await deleteDataByClientID(dbconnection.inMemory,
    //       [
    //            cliendID
    //       ],
    //       "retain_messages"
    //  )   
  }
  clearTimeout(socket.timerID)
}