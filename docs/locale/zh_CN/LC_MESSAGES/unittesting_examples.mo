��          �               |     }  (   �     �  '   �  5   �  )   2  1   \  (   �  R   �  P   
    [  �   v  5   l  �   �  2   4  &   g  %   �  .   �     �  �   �  j  �  l  	     n
  '   �
     �
  &   �
  2   �
  &     .   @  %   o  B   �  G   �       �   :  9     y   X  2   �  %     $   +  -   P     ~  �   �  N  5   1. Simple example 2. Testing a method involving msg.sender 3. Testing method execution 4. Testing a method involving msg.value Contract/Program to be tested: AttendanceRegister.sol Contract/Program to be tested: Sender.sol Contract/Program to be tested: Simple_storage.sol Contract/Program to be tested: Value.sol Here are some examples which can give you better understanding to plan your tests. Here is an example test file that use both try-catch blocks and low level calls: In Solidity, ether can be passed along with a method call which is accessed inside contract as msg.value. Sometimes, multiple calculations in a method are performed based on msg.value which can be tested with various values using Remix's Custom transaction context. See the example: In Solidity, msg.sender plays a great role in access management of a smart contract methods interaction. Different msg.sender can help to test a contract involving multiple accounts with different roles. Here is an example for testing such case: In this example, we test setting & getting variables. Note: Examples in this section are intended to give you a push for development. We don't recommend to rely on them without verifying at your end. Test contract/program: AttendanceRegister_test.sol Test contract/program: Sender_test.sol Test contract/program: Value_test.sol Test contract/program: simple_storage_test.sol Testing by Example To help in such cases, Solidity introduced the try-catch statement in version 0.6.0. Previously, we had to use low-level calls to track down what was going on. With Solidity, one can directly verify the changes made by a method in storage by retrieving those variables from a contract. But testing for a successful method execution takes some strategy. Well that is not entirely true, when a test is successful - it is usually obvious why it passed. However, when a test fails, it is essential to understand why it failed. Project-Id-Version:  remix-translation
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2022-06-20 17:14-0400
PO-Revision-Date: 2022-06-21 15:24+0000
Last-Translator: 
Language: zh_CN
Language-Team: Chinese Simplified
Plural-Forms: nplurals=1; plural=0;
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.10.3
 1. 简单的例子 2.测试一个涉及msg.sender的方法 3. 测试方法执行 4.测试一个涉及msg.value的方法 要测试的合约/程序：AttendanceRegister.sol 要测试的合约/程序：Sender.sol 要测试的合约/程序：Simple_storage.sol 要测试的合约/程序：Value.sol 以下是一些示例，可以让您更好地理解计划测试。 这是一个使用 try-catch 块和低级调用的示例测试文件： 在 Solidity 中，Eth可以与方法调用一起传递，该方法调用在合约内部作为 msg.value 访问。 有时，一个方法中的多个计算是基于 msg.value 执行的，可以使用 Remix 的自定义事务上下文使用各种值进行测试。 请参阅示例： 在 Solidity 中，msg.sender 在智能合约方法交互的访问管理中发挥着重要作用。 不同的 msg.sender 可以帮助测试涉及具有不同角色的多个账户的合约。 这是测试这种情况的示例： 在这个例子中，我们测试设置和获取变量。 注意：本节中的示例旨在推动您的开发。 我们不建议您在没有经过验证的情况下依赖它们。 测试合约/程序： AttendanceRegister_test.sol 测试合约/程序：Sender_test.sol 测试合约/程序：Value_test.sol 测试合约/程序：simple_storage_test.sol 示例测试 为了在这种情况下提供帮助，Solidity 在 0.6.0 版本中引入了 try-catch 语句。 以前，我们必须使用低级调用来追踪正在发生的事情。 使用 Solidity，人们可以通过从合约中检索这些变量来直接验证存储中的方法所做的更改。 但是测试一个成功的方法执行需要一些策略。 好吧，这并不完全正确，当测试成功时-通常很明显为什么它通过了。 但是，当测试失败时，必须了解它失败的原因。 