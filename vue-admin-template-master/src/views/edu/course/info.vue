<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" placeholder=" " />
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce";
export default {
  //声明组件
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {},
      courseId: "",
      BASE_API: process.env.BASE_API, // 接口API地址
      teacherList: [], //封装所有的讲师
      subjectOneList: [], //一级分类
      subjectTwoList: [], //二级分类
    };
  },
  created() {
    this.init();
  },
  watch: {
    //监听
    $route(to, from) {
      //路由变化方式，路由发生变化，方法就会执行
      this.init();
    },
  },
  methods: {
    init() {
      //判断路径有id值,做修改
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        this.getCourseInfoById();
        this.getAllTeacher();
      } else {
        //初始化讲师和一级分类
        //如果不给默认值，二级分类会显示不出来
        this.courseInfo = {
          title: "",
          subjectId: "", //二级分类id
          subjectParentId: "", //一级分类id
          teacherId: "",
          
          lessonNum: 0,
          description: "",
          cover: "",
          price: 0,
        };
        this.getAllTeacher();
        this.getOneSubject();
      }
    },
    //上传封面成功调用的方法
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data;
    },
    //上传之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2MByB = file.size / 1024 <= 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击某个一级分类，触发change，显示对应二级分类
    subjectLevelOneChanged(value) {
      //value就是一级分类id值
      //遍历所有的分类，包含一级和二级
      for (var i = 0; i < this.subjectOneList.length; i++) {
        //每个一级分类
        var oneSubject = this.subjectOneList[i];
        //判断：所有一级分类id 和 点击一级分类id是否一样
        if (value === oneSubject.id) {
          //从一级分类获取里面所有的二级分类
          this.subjectTwoList = oneSubject.subjects;
          //把二级分类id值清空
          this.courseInfo.subjectId = "";
        }
      }
    },
    //查询所有的一级分类
    getOneSubject() {
      subject.getAllSubjects().then((response) => {
        this.subjectOneList = response.data;
      });
    },
    //查询所有的讲师
    getAllTeacher() {
      course.getAllTeacher().then((response) => {
        this.teacherList = response.data;
      });
    },
    //修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseId, this.courseInfo).then((resp) => {
        //提示
        this.$message({
          type: "success",
          message: "修改课程信息成功!",
        });
        this.$router.push({ path: `/course/chapter/${this.courseId}` });
      });
    },
    //添加课程信息
    addCourseInfo() {
      course.addCourseInfo(this.courseInfo).then((response) => {
        //提示
        this.$message({
          type: "success",
          message: "添加课程信息成功!",
        });
        //跳转到第二步
        this.$router.push({ path: `/course/chapter/${response.data}` });
      });
    },
    //添加或修改课程信息
    saveOrUpdate() {
      if (this.courseInfo.id) {
        this.updateCourse();
      } else {
        this.addCourseInfo();
      }
    },
    //根据课程id查询
    getCourseInfoById() {
      course.getCourseInfoById(this.courseId).then((resp) => {
        //在courseInfo中包含一级分类id和二级分类id
        this.courseInfo = resp.data;
        //初始化分类列表
        subject.getAllSubjects().then((resp) => {
          // 获取所有一级分类
          this.subjectOneList = resp.data;
          for (let i = 0; i < this.subjectOneList.length; i++) {
            //每个一级分类
            let subjectOne = this.subjectOneList[i];
            //比较当前courseInfo里面一级分类id和所有的一级分类id
            if (this.courseInfo.subjectParentId == subjectOne.id) {
              this.subjectTwoList = subjectOne.subjects;
            }
          }
        });
      });
    },
  },
};
</script>
