import BigNumber from 'bignumber.js';

const toBigNumber = asset => {
  if (BigNumber.isBigNumber(asset)) {
    return asset;
  } else if (isNaN(asset)) {
    if (!asset) return new BigNumber('0');
    const match = asset.match(/^([0-9.]+) EOS$/);
    const amount = match ? match[1] : '0';
    return new BigNumber(amount);
  } else {
    return new BigNumber(asset);
  }
};

export const log = (...args) => {
    console.log(...args);
}
export const  json_html_style = (json) => {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

export const time_plus_hours = (time_str, split_in_space = false, plus_hour = 16) => {
    if(!time_str) return '';
    let [days, hours] = time_str.split('T');
    days = days.replace(/-/g, '/');
    hours = hours.split('.')[0];
    let date = days + ' ' + hours;
    let new_date = new Date(new Date(date).getTime() + plus_hour*60*60*1000);

    let month = new_date.getMonth() + 1;
    let day = new_date.getDate();
    let hour = new_date.getHours();
    let minutes = new_date.getMinutes();
    let seconds = new_date.getSeconds();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let res = `${new_date.getFullYear()}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    res = split_in_space ? res.replace(' ', '<br/>') : res;
    return res;
}

export const is_mobile = () => {
    if(document.body.offsetWidth < 800) return true;
    return false;
}
export const split_long_num = (num) => {
    let num_str = num + '';
    let [int_num, float_num = ''] = num_str.split('.');
    var num_arr = int_num.split('');
    var n = 0, n_arr = []; 
    for(let i of num_arr.reverse()){
        if(!(n%3) && n){n_arr.push(',');}
        n_arr.push(i);
        n ++;
    };
    return n_arr.reverse().join('') + (float_num ? '.' + float_num : '');
}

// '字符串或数字或 bignumber 格式转化为 XXX EOS 格式'
export const toAsset = (_amount, symbol = 'EOS', { precision = '4' } = {}) => {
  const amount = toBigNumber(_amount).toFixed(Number(precision));
  return [amount, symbol].join(' ');
};

// 计算是否有投票和分红和赎回金
export const calcVoteExist = (meVoteage, reward, unstaking) => {
  return !(toBigNumber(meVoteage).isZero() && toBigNumber(reward).isZero() && toBigNumber(unstaking).isZero());
};

// 计算年化利率
export const calcApr = (totalStaked, commissionRate) => {
  if (!totalStaked) return 0;
  const n1 = (9 * 20 * 60 * 24 * 365) / 23;
  return (n1 * (1 - commissionRate / 10000)) / totalStaked;
};

// 计算最新票龄
// 票龄 + 投票金额 * （当前高度 - 票龄更新高度）
export const calcVoteage = args => {
  const [voteage, staked, currentHeight, updateHeight] = args.map(toBigNumber);
  return voteage.plus(staked.multipliedBy(currentHeight.minus(updateHeight)));
};

// 计算分红
export const calcReward = args => {
  const [myVoteage, bpVoteage, rewardsPool] = args.map(toBigNumber);
  if (!bpVoteage.isZero()) {
    return myVoteage.multipliedBy(rewardsPool).dividedBy(bpVoteage);
  } else {
    return toBigNumber(0);
  }
};

// p 精度
// showSymbol 是否显示货币符号，默认不显示
// symbol 货币符号，默认为 EOS 或自动获取
// separator 是否使用逗号分隔数字，默认为真
// sign 数字后单位，默认空
// percentage 数字的倍率
export const formatNumber = (value, { p, showSymbol, symbol = 'EOS', separator = true, sign, percentage } = {}) => {
  if (BigNumber.isBigNumber(value)) {
    value = value.toNumber();
  }
  if (isNaN(value) && typeof value === 'string' && /^[0-9.-]+\s([A-Z]+)$/.test(value)) {
    [value, symbol] = value.split(' ');
  }
  if (typeof value === 'string' && !isNaN(value)) {
    if (p === undefined) {
      const match = value.match(/\.(\d*)/);
      if (match && match[1]) {
        p = match[1].length;
      } else {
        p = 0;
      }
    }
    value = Number(value);
  } else if (typeof value !== 'number') {
    return value;
  }
  if (percentage) {
    value = value * percentage;
  }
  if (!isNaN(p)) {
    value = value.toFixed(p);
  } else {
    value = String(value);
  }
  if (sign) {
    return value + sign;
  }
  if (separator) {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    value = parts.join('.');
  }
  if (showSymbol) {
    return [value, symbol].join(' ');
  }
  return value;
};