"use strict";

const LIUZHOU_FOOD_DATA = {
  common: [
    { name: "黄焖鸡米饭", tag: "盖饭", description: "汤汁浓郁、鸡肉入味，不知道吃什么时的稳妥选择。" },
    { name: "麻辣烫", tag: "自选", description: "想吃的都夹一点，荤素自由搭配，热乎又满足。" },
    { name: "兰州牛肉面", tag: "粉面", description: "清汤、牛肉和筋道面条，简单一碗也很舒服。" },
    { name: "重庆小面", tag: "粉面", description: "麻辣鲜香，适合想用一点重口味提振精神的时候。" },
    { name: "石锅拌饭", tag: "盖饭", description: "蔬菜、米饭和酱料拌匀，锅巴香是加分项。" },
    { name: "烤肉拌饭", tag: "盖饭", description: "烤肉香气配米饭和蔬菜，一碗就能吃得很饱。" },
    { name: "蛋炒饭", tag: "主食", description: "粒粒分明、简单管饱，赶时间时也很可靠。" },
    { name: "番茄鸡蛋盖饭", tag: "盖饭", description: "酸甜家常、清爽下饭，是不会出错的组合。" },
    { name: "猪脚饭", tag: "盖饭", description: "软糯猪脚配米饭和青菜，适合想吃扎实一点。" },
    { name: "猪肉饺子", tag: "面点", description: "皮薄馅香、热气腾腾，蘸点醋就很有满足感。" },
    { name: "鲜肉云吞", tag: "面点", description: "一口一个，配清汤或红油都很顺口。" },
    { name: "过桥米线", tag: "粉面", description: "热汤配丰富配料，暖和又有饱腹感。" },
    { name: "汉堡薯条", tag: "快餐", description: "酥脆、快捷，偶尔来一份也很快乐。" },
    { name: "炸鸡", tag: "快餐", description: "外酥里嫩，适合和朋友一起分享。" },
    { name: "披萨", tag: "聚餐", description: "适合多人分着吃，口味选择也更自由。" },
    { name: "寿司", tag: "简餐", description: "清爽轻便，想吃少一点时是不错的选择。" },
    { name: "咖喱饭", tag: "盖饭", description: "浓郁咖喱配米饭，温和又饱腹。" },
    { name: "轻食沙拉", tag: "轻食", description: "蔬菜和蛋白质搭配，给今天换一种轻盈口感。" },
    { name: "火锅", tag: "聚餐", description: "适合慢慢涮、边聊边吃，人多时尤其热闹。" },
    { name: "烧烤", tag: "夜宵", description: "几串烤肉配饮料，夜晚的烟火气就到位了。" },
    { name: "酸菜鱼", tag: "聚餐", description: "酸香开胃、鱼片嫩滑，适合两三个人一起吃。" },
    { name: "沙县小吃", tag: "简餐", description: "蒸饺、拌面和炖罐选择多，快速解决一餐。" },
    { name: "肠粉", tag: "早餐", description: "米皮薄滑、酱汁鲜香，早餐吃也很清爽。" },
    { name: "饭团", tag: "简餐", description: "方便携带、口味轻巧，适合课程安排很紧的时候。" }
  ],
  citywide: {
    label: "柳州全市",
    foods: [
      { name: "柳州螺蛳粉", tag: "粉面", description: "酸、辣、鲜、爽、烫，一碗就把柳州的味觉记忆叫醒。" },
      { name: "螺蛳鸭脚煲", tag: "锅物", description: "鸭脚炖得软糯入味，适合和朋友慢慢吃的一锅。" },
      { name: "炒螺", tag: "夜宵", description: "鲜辣够味，柳州夜宵摊上很有存在感的一道。" },
      { name: "卷粉", tag: "早餐", description: "米浆薄滑，裹上馅料和酱汁，清爽又有饱腹感。" },
      { name: "露水汤圆", tag: "小吃", description: "咸鲜软糯的本地味道，适合当作一顿暖胃早餐。" },
      { name: "芋头糕", tag: "小吃", description: "米香、芋香和煎香叠在一起，外脆内糯。" },
      { name: "柳州酸嘢", tag: "解腻", description: "酸甜爽脆，吃完粉后来一份刚刚好。" },
      { name: "融安滤粉", tag: "粉面", description: "现榨米粉配卤汁，口感软滑，是融安的日常味道。" },
      { name: "中渡柴火粉", tag: "粉面", description: "柴火气息配上热汤和米粉，朴实但很有地方特色。" },
      { name: "三江油茶", tag: "特色", description: "茶香、米花和酥脆配料一起入口，咸香醒神。" },
      { name: "侗家酸鱼", tag: "特色", description: "发酵带来的酸香很有辨识度，适合想尝鲜的一餐。" },
      { name: "柳城云片糕", tag: "点心", description: "薄而柔韧，米香清甜，适合做饭后小点。" }
    ]
  },
  districts: {
    "城中区": [
      { name: "螺蛳粉", tag: "粉面", description: "身处柳州中心城区，先来一碗最经典的酸辣鲜香。" },
      { name: "露水汤圆", tag: "早餐", description: "咸鲜软糯，老柳州人的早餐记忆之一。" },
      { name: "芋头糕", tag: "小吃", description: "煎到两面微脆，芋头和米香都很扎实。" },
      { name: "炒螺", tag: "夜宵", description: "夜里想吃点鲜辣有滋味的，炒螺很合适。" },
      { name: "卷粉", tag: "早餐", description: "薄滑米皮卷上馅料，酱汁一淋就很开胃。" },
      { name: "柳州酸嘢", tag: "解腻", description: "酸甜脆爽，逛街时随手来一份。" },
      { name: "糯米饭", tag: "主食", description: "香糯管饱，配点小菜就是踏实的一餐。" },
      { name: "螺蛳鸭脚煲", tag: "锅物", description: "汤汁浓郁、鸭脚软糯，适合慢慢吃的一锅。" }
    ],
    "鱼峰区": [
      { name: "螺蛳粉", tag: "粉面", description: "鱼峰区的日常主食选项，酸笋和辣油按自己的口味来。" },
      { name: "螺蛳鸭脚煲", tag: "锅物", description: "一锅热辣鲜香，鸭脚吸满汤汁后尤其入味。" },
      { name: "酸笋炒牛肉", tag: "家常", description: "酸笋的发酵香和牛肉的鲜嫩很下饭。" },
      { name: "烤鱼", tag: "聚餐", description: "适合两三个人分享，配菜越煮越有味。" },
      { name: "牛杂", tag: "小吃", description: "热汤里一碗牛杂，鲜香有嚼劲。" },
      { name: "烧烤", tag: "夜宵", description: "晚上想吃点烟火气，烧烤是稳妥选择。" },
      { name: "砂锅粥", tag: "暖胃", description: "热乎绵软，想吃得清淡一点时很合适。" },
      { name: "柳州酸嘢", tag: "解腻", description: "酸酸甜甜，给重口味的一餐收个尾。" }
    ],
    "柳南区": [
      { name: "干捞螺蛳粉", tag: "粉面", description: "没有汤的螺蛳粉更突出卤香和配料口感。" },
      { name: "炒螺蛳粉", tag: "粉面", description: "锅气更足，酸辣味和米粉的韧劲都更明显。" },
      { name: "烧鸭粉", tag: "粉面", description: "烧鸭的油香配上一碗热粉，简单又满足。" },
      { name: "卷粉", tag: "早餐", description: "米皮薄滑，早餐吃一份轻盈不负担。" },
      { name: "炖盅", tag: "暖胃", description: "慢炖出的汤水温润，适合想吃舒服一点的时候。" },
      { name: "云吞", tag: "小吃", description: "皮薄馅香，一碗热汤云吞很治愈。" },
      { name: "糖水", tag: "甜点", description: "饭后想加点甜，来一碗本地糖水。" },
      { name: "炒螺", tag: "夜宵", description: "鲜辣入味，很适合作为夜晚的加餐。" }
    ],
    "柳北区": [
      { name: "螺蛳粉", tag: "粉面", description: "想不到吃什么时，一碗螺蛳粉总不会出错。" },
      { name: "炒粉", tag: "主食", description: "大火快炒出锅气，忙碌时也能吃得满足。" },
      { name: "烤鱼", tag: "聚餐", description: "适合约上同学朋友，边煮边吃的一顿。" },
      { name: "烧烤", tag: "夜宵", description: "夜晚的烟火气，几串烤肉就能把心情拉回来。" },
      { name: "鸭脚煲", tag: "锅物", description: "软糯鸭脚和浓郁汤底，越吃越有味道。" },
      { name: "牛杂", tag: "小吃", description: "一碗热牛杂，汤鲜料足，适合当加餐。" },
      { name: "生榨米粉", tag: "粉面", description: "米粉带独特发酵香，配汤和肉末很顺口。" },
      { name: "豆腐花", tag: "甜点", description: "嫩滑清甜，吃完重口味后来一碗正好。" }
    ],
    "柳江区": [
      { name: "螺蛳粉", tag: "粉面", description: "柳江区的日常味道，酸辣鲜香一样不少。" },
      { name: "莲藕酿", tag: "家常", description: "莲藕的清甜配上肉馅，是很有本地感的一道菜。" },
      { name: "土鸡", tag: "聚餐", description: "肉质紧实有嚼劲，适合多人一起吃。" },
      { name: "河鱼", tag: "家常", description: "临近水系，河鱼做法鲜香，适合想吃清淡一点的时候。" },
      { name: "米粉", tag: "主食", description: "一碗热米粉，简单、快速，也很适合当早餐。" },
      { name: "糍粑", tag: "小吃", description: "软糯带米香，煎过之后表面更香。" },
      { name: "酸笋炒肉", tag: "家常", description: "酸香开胃，配米饭尤其合适。" },
      { name: "莲藕汤", tag: "暖胃", description: "汤清味甜，想吃得舒服时很好入口。" }
    ],
    "柳城县": [
      { name: "云片糕", tag: "点心", description: "柳城代表性点心，薄、软、清甜，米香细腻。" },
      { name: "牛腊巴", tag: "小吃", description: "肉香浓郁、越嚼越香，适合当零嘴或配餐。" },
      { name: "螺蛳粉", tag: "粉面", description: "县城里同样少不了的一碗酸辣鲜香。" },
      { name: "酸笋鸭", tag: "家常", description: "酸笋把鸭肉的香味衬得更足，很适合下饭。" },
      { name: "河鱼", tag: "家常", description: "以鲜香为主，适合几个人点一桌家常菜。" },
      { name: "米粉", tag: "主食", description: "早餐或正餐都能解决的一碗热米粉。" },
      { name: "糍粑", tag: "小吃", description: "软糯香甜，是很有地方气息的小吃。" }
    ],
    "鹿寨县": [
      { name: "中渡柴火粉", tag: "粉面", description: "到鹿寨值得尝试的本地米粉，柴火香气是特色。" },
      { name: "螺蛳粉", tag: "粉面", description: "在柳州辖区里，总能找到一碗合口味的螺蛳粉。" },
      { name: "酸笋鱼", tag: "家常", description: "酸香和鱼鲜相互衬托，很适合配米饭。" },
      { name: "河鱼", tag: "家常", description: "做法朴实，突出鱼肉本身的鲜味。" },
      { name: "油茶", tag: "特色", description: "咸香暖胃，适合想体验地方饮食的时候。" },
      { name: "糯米糍", tag: "小吃", description: "软糯带甜，作为饭后点心很合适。" },
      { name: "炒粉", tag: "主食", description: "锅气十足，赶时间时也能吃得有滋有味。" }
    ],
    "融安县": [
      { name: "融安滤粉", tag: "粉面", description: "现榨米粉软滑，卤汁和配菜让口感更丰富。" },
      { name: "芙蓉酥", tag: "小吃", description: "外酥内香，是融安有代表性的传统点心。" },
      { name: "烧炙", tag: "特色", description: "带着地方做法的香气，适合想尝点不一样的。" },
      { name: "螺蛳粉", tag: "粉面", description: "酸辣鲜香，想吃熟悉味道时的稳妥选择。" },
      { name: "油茶", tag: "特色", description: "茶香咸鲜，搭配米花和配料一起入口。" },
      { name: "酸鱼", tag: "特色", description: "发酵酸香很有辨识度，适合喜欢尝鲜的胃口。" },
      { name: "糯米饭", tag: "主食", description: "香糯扎实，配上小菜就是满足的一餐。" }
    ],
    "融水苗族自治县": [
      { name: "刮盆粉", tag: "粉面", description: "米香自然、口感软滑，是融水本地米粉吃法。" },
      { name: "苗家酸鱼", tag: "特色", description: "酸香浓郁，带有苗族传统饮食的独特风味。" },
      { name: "酸肉", tag: "特色", description: "发酵酸香突出，适合搭配米饭一起品尝。" },
      { name: "油茶", tag: "特色", description: "热乎咸香，既能暖胃也很有地方仪式感。" },
      { name: "竹筒饭", tag: "主食", description: "竹香和米香融合，吃起来朴实又有趣。" },
      { name: "香猪", tag: "聚餐", description: "肉质紧实、香味足，适合多人分享。" },
      { name: "烤鱼", tag: "聚餐", description: "外香里嫩，适合在县城慢慢吃一顿。" }
    ],
    "三江侗族自治县": [
      { name: "三江油茶", tag: "特色", description: "茶香、米花和酥脆配料叠加，咸香又醒神。" },
      { name: "侗族酸鱼", tag: "特色", description: "传统发酵酸香，是侗乡很有代表性的一道。" },
      { name: "酸肉", tag: "特色", description: "酸香开胃，和糯米饭搭配尤其合适。" },
      { name: "糯米饭", tag: "主食", description: "香糯有嚼劲，是侗乡餐桌上常见的主食。" },
      { name: "竹筒饭", tag: "主食", description: "带竹香的米饭，简单却很有地方特色。" },
      { name: "禾花鱼", tag: "家常", description: "鱼肉细嫩，适合做成鲜香的家常菜。" },
      { name: "侗家烧鱼", tag: "聚餐", description: "香气浓郁，适合和同行的人一起分享。" }
    ]
  }
};

if (typeof window !== "undefined") {
  window.LIUZHOU_FOOD_DATA = LIUZHOU_FOOD_DATA;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LIUZHOU_FOOD_DATA };
}
