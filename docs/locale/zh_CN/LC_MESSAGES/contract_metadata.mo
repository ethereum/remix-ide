��    
      l               �   8   �      �   5     %   >  �   d  o   K  <   �  �   �  �   �  l  +  6   �     �  0   �       �   /  \   �  ?   X  |   �  y      By default Remix automatically deploys needed libraries. Generate Artifact Here is a sample metadata file for linking a library: Library Deployment with filename.json Note that Remix will resolve addresses corresponding to the current network. By default, a configuration key follows the form: <network_name>:<networkd_id>, but it is also possible to define <network_name> or <network_id> as keys. When you open the metadata file for the libraries - artifact/filename.json you will see the following sections: You can write scripts that can access either of these files. autoDeployLib defines if the libraries should be auto deployed by Remix or if the contract should be linked with libraries described in linkReferences linkReferences contains a map representing libraries which depend on the current contract. Values are addresses of libraries used for linking the contract. Project-Id-Version:  remix-translation
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2022-08-16 13:45+0800
PO-Revision-Date: 2022-06-21 15:22+0000
Last-Translator: 
Language: zh_CN
Language-Team: Chinese Simplified
Plural-Forms: nplurals=1; plural=0;
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.10.3
 默认情况下，Remix 会自动部署所需的库。 生成定制器 这是用于链接库的示例元数据文件： 使用 filename.json 部署库 请注意，Remix 将解析与当前网络对应的地址。 默认情况下，配置键遵循以下形式：<network_name>:<networkd_id>，但也可以将 <network_name> 或 <network_id> 定义为键。 当您打开库的元数据文件 - artifact/filename.json 时，您将看到以下部分： 您可以编写可以访问其中任何一个文件的脚本。 autoDeployLib 定义库是否应由 Remix 自动部署，或者合约是否应与 linkReferences 中描述的程序库链接 linkReferences 包含一个表示依赖于当前合约的库的映射。 值是用于链接合约的程序库的地址。 