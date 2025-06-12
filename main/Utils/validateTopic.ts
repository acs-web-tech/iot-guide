export function topicInspect(topicBuffer){
       let utf8 = topicBuffer.toString('utf8')
       let restrictedChars = new RegExp(/[@!%^&*()|\\=+#{}\[\]\$?.<>]/i)
        //  check byte size atleast>1
       if(topicBuffer.byteLength > 65535 || topicBuffer.byteLength<1) return true;
       // Check null byte 
       if(utf8.indexOf("\u0000") > -1) return true;
       // Check Root publish
       if(utf8.indexOf("$SYS") > -1) return true;
       // Special Chars
       if(restrictedChars.test(utf8)) return true;
}
const publishBuf = Buffer.from([74, 65, 0x6D, 70,0x0] )
// $SYS
Buffer.from([
     0x24, 0x53, 0x59, 0x53, 0x2F,
  0x62, 0x72, 0x6F, 0x6B, 0x65, 0x72,
  0x2F, 0x72, 0x65, 0x62, 0x6F, 0x6F, 0x74,
])
// Null byte
Buffer.from([0x0,74, 65, 0x6D, 70] )
//Normal packet
Buffer.from([
             // Topic length = 12
  0x73, 0x65, 0x6E, 0x73, 0x6F, 0x72, 0x73, 0x2F, 0x74, 0x65, 0x6D, 0x70, // "sensors/temp"

]);
//TopicInspect(publishBuf)