var Host;
var xhr = new XMLHttpRequest();
xhr.open('get', '@/../static/serverconfig.json',false);
xhr.send(null);
Host = (JSON.parse(xhr.responseText)).Host;
var webApi = {
  // Host:'http://daniu.51vip.biz:10698/gyssApp_test',
  Host: Host,
//权限控制器。根据方法设置token
  Auth : {
    Login: '/api/Auth/Login', //登录; 方式:POST; 是否需要token:不需要；参数说明:[data=》登录数据；]
    Logout: '/api/Auth/Logout', //注销; 方式:POST; 是否需要token:需要；参数说明:[]
    ChangePwd: '/api/Auth/ChangePwd', //修改密码; 方式:POST; 是否需要token:需要；参数说明:[newPwd=》新密码；]
    LoginWxApp: '/api/Auth/LoginWxApp?code={code}', //微信小程序登录接口; 方式:GET; 是否需要token:不需要；参数说明:[code=》微信小程序内调用wx.login获取的code；]
    LoginWxZxApp: '/api/Auth/LoginWxZxApp?code={code}', //; 方式:GET; 是否需要token:不需要；参数说明:[code=》未注释；]
  },
//新闻。根据方法设置token
  News : {
    GetNews: '/api/News/GetNews?keyword={keyword}&p={p}&ps={ps}', //获取新闻集合; 方式:GET; 是否需要token:不需要；参数说明:[keyword=》未注释；p=》未注释；ps=》未注释；]
    GetTopNews: '/api/News/GetTopNews?top={top}', //获取首页显示的新闻信息; 方式:GET; 是否需要token:不需要；参数说明:[top=》前几条，默认10条，最大10条。【参数暂时不用】；]
    Get: '/api/News/Get/{id}', //获取指定的新闻信息; 方式:GET; 是否需要token:不需要；参数说明:[id=》新闻编号；]
    GetCityFreq: '/api/News/GetCityFreq?province={province}', //获取各地在新闻中出现的频次; 方式:GET; 是否需要token:不需要；参数说明:[province=》省份；]
  },
//线索。根据方法设置token
  Clue : {
    GetClueTypes: '/api/Clue/GetClueTypes', //获取线索类型集合(互联网); 方式:GET; 是否需要token:需要；参数说明:[]
    GetClueSites: '/api/Clue/GetClueSites', //获取线索来源网站集合; 方式:GET; 是否需要token:需要；参数说明:[]
    GetClueOrderFields: '/api/Clue/GetClueOrderFields', //获取线索排序字段集合; 方式:GET; 是否需要token:需要；参数说明:[]
    GetWebClues: '/api/Clue/GetWebClues?keyword={keyword}&type={type}&site={site}&order={order}&p={p}&ps={ps}', //获取互联网线索集合; 方式:GET; 是否需要token:需要；参数说明:[keyword=》关键词；type=》线索类型；site=》采集站点名称；order=》排序字段，默认为采集日期；p=》页码；ps=》页面大小，最大20；]
    GetWebClueData: '/api/Clue/GetWebClueData/{id}', //获取指定互联网线索; 方式:GET; 是否需要token:需要；参数说明:[id=》线索编号；]
    GetReportClueData: '/api/Clue/GetReportClueData/{id}', //获取指定举报线索; 方式:GET; 是否需要token:需要；参数说明:[id=》举报线索编号；]
    GetReportClues: '/api/Clue/GetReportClues?keyword={keyword}&type={type}&p={p}&ps={ps}', //获取举报线索集合; 方式:GET; 是否需要token:需要；参数说明:[keyword=》未注释；type=》线索类型；p=》页码；ps=》页面大小；]
    AddResults: '/api/Clue/AddResults', //线索处理结果; 方式:POST; 是否需要token:需要；参数说明:[data=》json数据：包含xsbh，cljg：处理结果；]
    ClueRead: '/api/Clue/ClueRead?xssjbly={xssjbly}&xsbh={xsbh}', //线索已读。url传参; 方式:POST; 是否需要token:需要；参数说明:[xssjbly=》线索数据表来源。1:举报线索；2：互联网线索；3：公益组织线索；4：热点线索；5：自行发现线索；xsbh=》线索编号；]
    GetWebClueKeywordFreq: '/api/Clue/GetWebClueKeywordFreq', //获取互联网线索关键词频; 方式:GET; 是否需要token:需要；参数说明:[]
  },
//统计。根据方法设置token
  Stats : {
    CountMonthClues: '/api/Stats/CountMonthClues?beginDate={beginDate}&endDate={endDate}', //计算本月线索数量; 方式:POST; 是否需要token:需要；参数说明:[beginDate=》统计开始时间；endDate=》统计结束时间；]
    CountClues: '/api/Stats/CountClues', //计算线索总数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountFollowClues: '/api/Stats/CountFollowClues', //计算关注线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountMonthFollowClues: '/api/Stats/CountMonthFollowClues?beginDate={beginDate}&endDate={endDate}', //计算关注线索数量 统计开始时间统计结束时间; 方式:POST; 是否需要token:需要；参数说明:[beginDate=》未注释；endDate=》未注释；]
    CountUnReciveClues: '/api/Stats/CountUnReciveClues', //计算未接收线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountMonthCluesType: '/api/Stats/CountMonthCluesType?beginDate={beginDate}&endDate={endDate}', //按类型计算本月线索数量; 方式:POST; 是否需要token:需要；参数说明:[beginDate=》统计开始时间；endDate=》统计结束时间；]
    CountCluesType: '/api/Stats/CountCluesType', //按类型计算总线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountMonthSubHandled: '/api/Stats/CountMonthSubHandled', //计算本月下级院已办线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountSubHandled: '/api/Stats/CountSubHandled', //计算下级院已办总线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountMonthSubReciveClues: '/api/Stats/CountMonthSubReciveClues', //计算已接收线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountSubReciveClues: '/api/Stats/CountSubReciveClues', //计算已接收总线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountUnhandled: '/api/Stats/CountUnhandled', //计算未处理线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountUnConfirmClues: '/api/Stats/CountUnConfirmClues', //计算待确认线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountReciveClues: '/api/Stats/CountReciveClues', //计算接收线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountSubReviceCluesType: '/api/Stats/CountSubReviceCluesType', //按类型计算接收线索数量; 方式:POST; 是否需要token:需要；参数说明:[]
    CountHanddingClues: '/api/Stats/CountHanddingClues', //计算处理中的线索总量; 方式:GET; 是否需要token:需要；参数说明:[]
  },
//业务处理控制器。根据方法设置token
  ClueManager : {
    GetFollowClues: '/api/ClueManager/GetFollowClues?xssjbly={xssjbly}&xslb={xslb}&sfbl={sfbl}&keyword={keyword}&beginDate={beginDate}&endDate={endDate}&pageNum={pageNum}&pageSize={pageSize}&order={order}', //获取关注线索列表; 方式:GET; 是否需要token:需要；参数说明:[xssjbly=》线索数据表来源。1:举报线索；2：互联网线索；3：公益组织线索；4：热点线索；5：自行发现线索；xslb=》线索类别；sfbl=》是否办理。true:已办理，false：未办理，为空：全部；keyword=》关键字；beginDate=》开始时间；endDate=》结束时间；pageNum=》页码；pageSize=》页大小；order=》排序字段；]
    GetLDFollowClues: '/api/ClueManager/GetLDFollowClues?xssjbly={xssjbly}&xslb={xslb}&keyword={keyword}&sfbl={sfbl}&beginDate={beginDate}&endDate={endDate}&pageNum={pageNum}&pageSize={pageSize}&order={order}', //获取领导关注线索列表; 方式:GET; 是否需要token:需要；参数说明:[xssjbly=》线索数据表来源。1:举报线索；2：互联网线索；3：公益组织线索；4：热点线索；5：自行发现线索；xslb=》线索类别；keyword=》关键字；sfbl=》是否办理。1：未办理，2：已办理；beginDate=》开始时间；endDate=》结束时间；pageNum=》页码；pageSize=》页大小；order=》排序字段；]
    FollowClue: '/api/ClueManager/FollowClue?xsid={xsid}&xssjbly={xssjbly}', //关注线索; 方式:POST; 是否需要token:需要；参数说明:[xsid=》线索编号；xssjbly=》线索数据表来源。1:举报线索；2：互联网线索；3：公益组织线索；4：热点线索；5：自行发现线索；]
    UnFollowClue: '/api/ClueManager/UnFollowClue?xsid={xsid}&xssjbly={xssjbly}', //取消关注线索; 方式:POST; 是否需要token:需要；参数说明:[xsid=》线索编号；xssjbly=》线索数据表来源。1:举报线索；2：互联网线索；3：公益组织线索；4：热点线索；5：自行发现线索；]
    UpdateClueType: '/api/ClueManager/UpdateClueType', //修改线索的所属类别; 方式:POST; 是否需要token:需要；参数说明:[data=》包含线索编号(xsbh)、修改后的线索类别(xslb)、以及可以包含对线索的备注信息(bz)；]
    SaveClueOpinion: '/api/ClueManager/SaveClueOpinion', //提交线索初核意见; 方式:POST; 是否需要token:需要；参数说明:[data=》包含线索编号(xsbh)、线索初核意见(xschyj)；]
    GetApprovalClues: '/api/ClueManager/GetApprovalClues?type={type}&keyword={keyword}&xslb={xslb}&beginDate={beginDate}&endDate={endDate}&pageNum={pageNum}&pageSize={pageSize}', //获取领导审批线索列表; 方式:GET; 是否需要token:需要；参数说明:[type=》type:0-待审批;1-已审批;2-全部；keyword=》查找关键词；xslb=》线索类别；beginDate=》查询起始日期；endDate=》查询结束日期；pageNum=》未注释；pageSize=》未注释；]
    Approval: '/api/ClueManager/Approval', //领导审批; 方式:POST; 是否需要token:需要；参数说明:[data=》传入审批编号spbh，以及审批意见spyj。；]
    GetApprovalResult: '/api/ClueManager/GetApprovalResult?gzbh={gzbh}', //; 方式:GET; 是否需要token:需要；参数说明:[gzbh=》未注释；]
    DispatchClue: '/api/ClueManager/DispatchClue/{id}?cbdwbh={cbdwbh}&cbdwmc={cbdwmc}', //分发线索; 方式:POST; 是否需要token:需要；参数说明:[id=》关注线索编号；cbdwbh=》承办人单位编号；cbdwmc=》未注释；]
    GetSubClues: '/api/ClueManager/GetSubClues?type={type}&keywords={keywords}&xslb={xslb}&beginDate={beginDate}&endDate={endDate}&pageNum={pageNum}&pageSize={pageSize}&order={order}', //获取线索列表; 方式:GET; 是否需要token:需要；参数说明:[type=》type=0:待确认接收；1：正在办理；2：已反馈结果;3：全部；keywords=》关键字；xslb=》线索类别；beginDate=》未注释；endDate=》未注释；pageNum=》未注释；pageSize=》未注释；order=》未注释；]
    RecvClues: '/api/ClueManager/RecvClues/{id}', //确认接收线索; 方式:POST; 是否需要token:需要；参数说明:[id=》关注编号；]
    ReportResult: '/api/ClueManager/ReportResult/{id}?bljgjs={bljgjs}', //填写办理结果简述; 方式:POST; 是否需要token:需要；参数说明:[id=》关注编号；bljgjs=》办理结果简述；]
    GetResult: '/api/ClueManager/GetResult?gzbh={gzbh}', //获取办理结果; 方式:GET; 是否需要token:需要；参数说明:[gzbh=》关注编号；]
  },
//知识库。根据方法设置token
  Knowledge : {
    GetKnowledges: '/api/Knowledge/GetKnowledges?keyword={keyword}&type={type}&p={p}&ps={ps}', //获取知识库信息; 方式:GET; 是否需要token:不需要；参数说明:[keyword=》未注释；type=》类型：理论研究、法律法规；p=》未注释；ps=》未注释；]
    Get: '/api/Knowledge/Get/{id}', //获取指定信息; 方式:GET; 是否需要token:不需要；参数说明:[id=》未注释；]
    GetTop: '/api/Knowledge/GetTop?top={top}', //获取首页显示的信息; 方式:GET; 是否需要token:不需要；参数说明:[top=》前几条，默认10条，最大10条。【参数暂时不用】；]
  },
//。根据方法设置token
  WebData : {
    CountData: '/api/WebData/CountData?sjsybh={sjsybh}', //; 方式:GET; 是否需要token:需要；参数说明:[sjsybh=》未注释；]
    GetData: '/api/WebData/GetData?sjsybh={sjsybh}&p={p}&ps={ps}', //; 方式:GET; 是否需要token:需要；参数说明:[sjsybh=》未注释；p=》未注释；ps=》未注释；]
    GetAllTables: '/api/WebData/GetAllTables', //; 方式:GET; 是否需要token:需要；参数说明:[]
    SearchDetail: '/api/WebData/SearchDetail?sjsybh={sjsybh}&keywords={keywords}&p={p}&ps={ps}', //; 方式:GET; 是否需要token:需要；参数说明:[sjsybh=》未注释；keywords=》未注释；p=》未注释；ps=》未注释；]
    SearchIndex: '/api/WebData/SearchIndex?keywords={keywords}', //; 方式:GET; 是否需要token:需要；参数说明:[keywords=》未注释；]
  },
//文本分析接口。根据方法设置token
  TextAnalysis : {
    GetSummary: '/api/TextAnalysis/GetSummary', //获取摘要; 方式:POST; 是否需要token:不需要；参数说明:[p=》未注释；]
    GetKeyword: '/api/TextAnalysis/GetKeyword', //获取关键词; 方式:POST; 是否需要token:不需要；参数说明:[p=》未注释；]
    GetSegment: '/api/TextAnalysis/GetSegment', //获取人名、地名、机构名; 方式:POST; 是否需要token:不需要；参数说明:[p=》未注释；]
  },
//用户管理。根据方法设置token
  User : {
    GetUser: '/api/User/GetUser', //获取当前用户信息; 方式:GET; 是否需要token:需要；参数说明:[]
    GetUserSalesperson: '/api/User/GetUserSalesperson', //获取当前用户对应的销售人员信息; 方式:GET; 是否需要token:需要；参数说明:[]
    GetUserSubOrgs: '/api/User/GetUserSubOrgs', //获取当前用户单位的下级单位列表; 方式:GET; 是否需要token:需要；参数说明:[]
  },
//微信线索控制器。全部需要token
  WxClue : {
    GetClue: '/api/WxClue/GetClue/{id}', //获取指定举报线索; 方式:GET; 参数说明:[id=》线索编号；]
    GetClues: '/api/WxClue/GetClues?keyword={keyword}&pageNum={pageNum}&pageSize={pageSize}', //获取举报线索集合; 方式:GET; 参数说明:[keyword=》关键词；pageNum=》页码；pageSize=》页大小；]
    Add: '/api/WxClue/Add', //新增举报线索; 方式:POST; 参数说明:[data=》未注释；]
    Update: '/api/WxClue/Update', //修改举报线索（暂不实现）; 方式:POST; 参数说明:[data=》未注释；]
    UploadFile: '/api/WxClue/UploadFile', //上传文件（支持多文件）; 方式:POST; 参数说明:[]
    DownLoadFile: '/api/WxClue/DownLoadFile/{id}', //下载文件流; 方式:GET; 参数说明:[id=》文件编号；]
  },
}
window.webApi = webApi;

