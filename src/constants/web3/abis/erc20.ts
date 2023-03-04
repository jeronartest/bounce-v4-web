export default [
  // Some details about the token
  // 代币信息
  'function name() view returns (string)',
  'function symbol() view returns (string)',

  // Get the account balance
  // 获取指定账户地址的代币余额
  'function balanceOf(address) view returns (uint)',

  // Send some of your tokens to someone else
  // 发送指定数量的代币到指定地址
  'function transfer(address to, uint amount)',

  // 向某个账户地址指定可用代币额度
  'function approve(address spender, unit amount) nonpayable returns (bool)',

  // An event triggered whenever anyone transfers to someone else
  // 该合约的代币发生转账时会触发的事件
  'event Transfer(address indexed from, address indexed to, uint amount)',
]
