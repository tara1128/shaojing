/*
* Old datas for miwifi_download.html, logs shown in Pops
* Latest modified on 2014-09-29 15:14
* DEV is for develop version, STA is for stable version
*/

var title_r1dsta = '小米路由器ROM 稳定版 0.7.61（9月25日更新）';
var log_r1dsta = '<div class="popLogContents">\
								    <p class="logtlt">热点功能</p>\
									  <ol>\
									    <li>手机相册一键备份至小米路由器，家庭私有云，数据安全不丢失</li>\
									    <li>小米路由成绩单，根据你的上网习惯，生成周报，分享至社交网络</li>\
									  </ol>\
								    <p class="logtlt">新第三方插件</p>\
									  <ol>\
									    <li>新增“迅雷游戏加速”插件，有效降低网络延迟，更畅快的游戏体验</li>\
									    <li>新增“网页广告过滤”插件，清除广告页面清爽，更舒适的浏览体验</li>\
									    <li>新增“光影照片管家”插件，更新“小米精彩时刻”的视频资源</li>\
									  </ol>\
								    <p class="logtlt">功能与优化</p>\
									  <ol>\
									    <li>优化了PPPoE拨号、DHCP的可靠性，外网连接更加稳定</li>\
									    <li>优化了下载的稳定性，升级迅雷下载引擎，修复了某些情况下无法加速的bug</li>\
									    <li>新增DMZ，DDNS等高级功能，优化了QoS智能限速功能</li>\
									    <li>新增了USB接口对exFAT文件系统的支持</li>\
									  </ol>\
								    <p class="logtlt">更多细节改进</p>\
									  <ol>\
									    <li>优化了QoS智能限速功能，在线看视频的时候，网络游戏的延迟更小了</li>\
									    <li>优化了系统日志的记录策略，更少的访问硬盘以延长寿命</li>\
									    <li>修复了当资源url过长时，迅雷下载引擎无法顺利加速的问题</li>\
									    <li>修复了一些潜在的安全漏洞，优化了web管理后台登录的安全性</li>\
									    <li>优化了Web管理页面的菜单分类与功能排序</li>\
									    <li>优化了OTA升级的可靠性，ROM安装文件更加轻简</li>\
									    <li>修改刷机时MD5验证方案，让刷机更加靠谱</li>\
									    <li>修复了智能场景中，定时开机后不能联网的问题，并校准了智能场景的执行时间</li>\
									    <li>修复了设备管理列表中，连接设备的信息可能显示错误的问题</li>\
									    <li>优化了PPTP/L2TP功能本地网络流量智能判断策略，增加了对host规则里不同类型规则的支持</li>\
									    <li>优化了网络测速功能，下行带宽的测速更加精准</li>\
									    <li>优化了Wi-Fi对部分DELL机型所使用网卡的兼容性</li>\
									    <li>修复了USB接口插U盘后，偶现的访问出错的问题</li>\
									    <li>优化了外网设置调整后WAN口和DNSmasq的重启策略</li>\
									    <li>修复了DHCP静态IP绑定功能手工输入与绑定可能失败的bug</li>\
									    <li>修复PPPoE拨号在某些状况下无法连接的问题，提高拨号上网的成功率</li>\
									    <li>修复小部分用户网络检测时，DNS解析失败的问题</li>\
									    <li>修复了手机上传的视频在某些状况下无法显示的Bug</li>\
									    <li>修复了小米电视/盒子通过DLNA访问路由器有个别文件夹无法显示的问题</li>\
									    <li>修复了获取CPU温度错误的Bug</li>\
									    <li>修复了多个目录删除时会重复提醒的bug</li>\
									    <li>修复了重复上传相同文件去重失败的bug</li>\
									  </ol>\
								  </div>';
var r1dsta = [ title_r1dsta, log_r1dsta ];

var title_r1ddev = '小米路由器ROM 开发版 0.8.9（9月25日更新）';
var log_r1ddev = '<div class="popLogContents">\
										<p class="logtlt">最新推荐：</p>\
										<p>新增了安卓App中文件管理的分类视图，可分类查看路由盘内的影片和图片，更快捷的找到你想要的文件。</p>\
										<p>除了备份手机相册，PC的文件也可以备份至小米路由器了，重要的文件自动备份，安全、省心。</p>\
										<p class="logtlt">ROM 更新日志：</p>\
										<ol>\
										  <li>新增了路由盘文件的分类视图，可分类浏览路由器的视频、图片文件</li>\
										  <li>新增第三方插件“迅雷游戏加速”</li>\
										  <li>优化了设备的流量统计，使其变得更加准确</li>\
										  <li>优化了使用PPTP/L2TP时访问本地资源的判断策略</li>\
										  <li>优化了数据备份时视频文件的去重策略</li>\
										  <li>优化了应用限速策略，默认会自动调整迅雷下载的限制速度</li>\
										  <li>修复了路由器意外断电后，可能出现的reset不成功的问题</li>\
										</ol>\
										<p class="logtlt">Android App 更新日志：</p>\
										<ol>\
										  <li>新增了文件管理的相册视图和影片视图</li>\
										  <li>优化了首页界面，对页面细节进行了微调</li>\
										</ol>\
										<p class="logtlt">PC Client 更新日志：</p>\
										<ol>\
										  <li>新增了PC的文件备份功能，可将PC的指定目录或全盘文档备份至路由器</li>\
										  <li>新增了客户端自动登录功能，不必每次验证密码</li>\
										  <li>修复了一些bug，提高了稳定性</li>\
										</ol>\
                  </div>';
var r1ddev = [ title_r1ddev, log_r1ddev ];

var title_r1cdev = '小米路由器mini 开发版 0.5.44（9月25日更新）';
var log_r1cdev = '<div class="popLogContents">\
								     <p class="logtlt">最新推荐：</p>\
								     <p>新增网络优化功能，在Wi-Fi网络不顺畅的时候，可通过手机App优化路由器的Wi-Fi信道，避开干扰，更畅快的享受无线网络。</p>\
								     <p class="logtlt">ROM 更新日志：</p>\
										 <ol>\
										   <li>新增了网络优化功能，可优化路由器的Wi-Fi信道，避开干扰，让无线网络更加稳定</li>\
										   <li>新增了2.4G没有开启的情况下，进入中继模式的引导策略</li>\
										   <li>修复了手动设置Wi-Fi频段带宽后，带宽无法固定的问题</li>\
										   <li>修复了设置DDNS时，某些正常状况下报错问题</li>\
										 </ol>\
								     <p class="logtlt">Android App 更新日志：</p>\
										 <ol>\
										   <li>增加了信道优化功能</li>\
										   <li>优化了首页界面，对页面细节进行了微调</li>\
										 </ol>\
								     <p class="logtlt">PC Client 更新日志：</p>\
										 <ol>\
										   <li>新增了客户端自动登录功能，不必每次验证密码</li>\
										   <li>修复了一些bug，提高了稳定性</li>\
										 </ol>\
                   </div>';
var r1cdev = [ title_r1cdev, log_r1cdev ];

var title_r1csta = '小米路由器mini 稳定版 0.5.8（9月25日更新）';
var log_r1csta = '<div class="popLogContents">\
								     <p class="logtlt">热点功能</p>\
										 <ol>\
										   <li>优化了USB外接存储的体验，存储、下载、访问的体验更畅快了</li>\
										   <li>新增了NTFS存储格式的支持，PC/Mac客户端可访问存储设备了</li>\
										   <li>升级了迅雷下载引擎，下载更加稳定</li>\
										 </ol>\
								     <p class="logtlt">新第三方插件</p>\
										 <ol>\
										   <li>新增第三方插件“迅播影院”，海量资源一键下载</li>\
										 </ol>\
								     <p class="logtlt">功能与优化</p>\
										 <ol>\
										   <li>优化了5G Wi-Fi的稳定性，OTA升级也更加可靠了</li>\
										 </ol>\
								     <p class="logtlt">更多细节改进</p>\
										 <ol>\
										   <li>新增了对NTFS存储格式的支持</li>\
										   <li>增加了PC客户端与MAC客户端对插入USB存储设备之后的相关支持</li>\
										   <li>新增加第三方插件“迅播影院”，请在插件中心中搜索非官方插件添加</li>\
										   <li>优化了QoS智能限速策略，开关QoS功能不再需要重启路由器</li>\
										   <li>优化了web管理后台高级设置中导航方式与UI的细节体验</li>\
										   <li>优化了Android APP在插入USB 存储设备之后的初始化体验，以及USB存储设备异常的相关处理</li>\
										   <li>更新了插件“小米精彩时刻”，更多小米产品2014年最新高清视频</li>\
										   <li>优化了5G Wi-Fi的稳定性</li>\
										   <li>修复了中继模式与路由器模式切换后可能带来的无线网络加密方式设置项的bug</li>\
										   <li>更新了迅雷下载引擎，升级到更加稳定、修复了诸多问题的版本</li>\
										   <li>修复了当路由器重启或者升级后，连接的设备名称变成MAC地址的Bug</li>\
										   <li>修复了OTA或刷机后，偶现的黄灯常亮无法启动的问题</li>\
										 </ol>\
									</div>';
var r1csta = [ title_r1csta, log_r1csta ];

var title_wifipc = '小米随身WiFi PC版驱动2.3  (9月18日更新)';
var log_wifipc = '<div class="popLogContents">\
                  <p class="logtlt">新增：</p>\
									<ol>\
									  <li>支持手机App上传文件至电脑，从此可以跟数据线说再见了</li>\
									  <li>增加了修复中文SSID乱码的功能</li>\
									</ol>\
                  <p class="logtlt">优化：</p>\
									<ol>\
									  <li>优化了手机App传输文件时的提示</li>\
									  <li>优化了网卡模式下记录已经连入过的wifi的策略</li>\
									</ol>\
                  <p class="logtlt">修复：</p>\
									<ol>\
									  <li>修复了XP系统下显示网卡未连接的问题</li>\
									  <li>修复了某些情况下云U盘界面颜色不一致的问题</li>\
									  <li>修复了某些情况下一直显示正在创建的问题</li>\
									  <li>修复了重新创建后隐藏SSID设置失效的问题</li>\
									</ol>\
                </div>';
var wifipc = [ title_wifipc, log_wifipc ];
