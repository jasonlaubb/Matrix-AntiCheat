//@ts-nocheck
function catDestroy(message: any, key: any) {
    const preoutput = message.split('').map(char => char.charCodeAt(0).toString(16)).join('');
    const number = "0123456789";
    let output = `${key}`
    for (let i = 0; i < preoutput.length; i ++) {
      if (!number.includes(preoutput[i])) {
        const st1 = "abAB"
        const st2 = "cdCD"
        const st3 = "efEF"
        if(st1.includes(preoutput[i])) output = output + 9 + Math.round(key.length / 4)
        if(st2.includes(preoutput[i])) output = output + 25 + Math.round(key.length / 3)
        if(st3.includes(preoutput[i])) output = output + 475 + Math.round(key.length / 2)
        i++
      } else output += preoutput[i]
    }
    output = BigInt(output) * BigInt(key);
    output = `${output}`;
    output = output.replace(/0/g, 'adhe');
    output = output.replace(/1/g, 'kwT0');
    output = output.replace(/2/g, 't2sw');
    output = output.replace(/3/g, 'ua4i');
    output = output.replace(/4/g, 'f8aw');
    output = output.replace(/5/g, '2M9s');
    output = output.replace(/6/g, '7a4z');
    output = output.replace(/7/g, 'pm4Q');
    output = output.replace(/8/g, 'dKt2');
    output = output.replace(/9/g, 'mg1d');
    output = output.replace(/e/g, '0g3o');
    output = output.replace(/\+/g, 'wqsp');
    output = output.replace(/\./g, 's95e');
    const preoutputII = output.split('').map(char => char.charCodeAt(0).toString(2)).join('');
    output = ''
    for(let i = 0; i < preoutputII.length; i += 1){
      if(preoutputII[i] == "0"){
          output += preoutputII[i]
       } else {
          output += preoutputII[i]
          i += 2
       }
    }
    output = BigInt(output) * BigInt(Math.round(key / output.length) * -output.length)
    output = BigInt(output) / BigInt(key ^ output.length)
    output = `${btoa(output.toString(36))}`
    output = btoa(output.replace(/\=/g, key.slice(key.length - 6)));
    return output;
  }