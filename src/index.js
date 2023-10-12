import model from './model.js';
var mod = new model();
var questions = mod.data.questions;
var sorted_questions = questions;
var tags = mod.data.tags;
var answers = mod.data.answers;
var target_quest_id = "";
var got_target_quest_id = 0;
var target_tag_id = "";
var got_target_tag_id = 0;
var searched = 0;

window.onload = function () {
  // fill me with relevant code
  sorted_questions = newest_sort_default(questions);
  mainPage();

  const askingButton = document.getElementById("askQ_main");
  askingButton.addEventListener('click', askButton);

  const questionButton = document.getElementById("question_menu");
  questionButton.addEventListener('click', questButton);

  const newestButton = document.getElementById("new_button");
  newestButton.addEventListener('click', newest_sort);

  const activeButton = document.getElementById("active_button");
  activeButton.addEventListener('click', active_sort);

  const unansweredButton = document.getElementById("unanswer_button");
  unansweredButton.addEventListener('click', unanswered_sort);

  const tagMenuButton = document.getElementById("tag_menu");
  tagMenuButton.addEventListener('click', tagButton);

  const searchInput = document.getElementById("search_input");
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      searching_by_input();
      // document.getElementById("search_input").value = "";
    }
  });

  document.getElementById("ask_question_page").style.display = "none";
  document.getElementById("question_content_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "none";
  document.getElementById("tag_page").style.display = "none";
};

const searching_by_input = () => {
  document.getElementById("question_content_page").style.display = "none";
  document.getElementById("ask_question_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "none";
  document.getElementById("all_question_and_buttons").style.display = "block";
  document.getElementById("tag_page").style.display = "none";

  document.getElementById("question_menu").style.background = "none";
  document.getElementById("tag_menu").style.background = "none";
  let search_Input = document.getElementById("search_input");
  let words = search_Input.value.toLowerCase();
  let searched_questions = [];
  let word_questions = [];
  let tag_questions = [];

  let split_by_space = words.split(" ");

  console.log(split_by_space[0][0]);

  for (let i = 0; i < split_by_space.length; i++) {
    if (split_by_space[i] == '') continue;
    else if (split_by_space[i].includes('[') && split_by_space[i].includes(']')) {
      let is_last_word_tag = true;
      let idx = 0;
      let tmp_str = "";
      while (idx < split_by_space[i].length) {
        if (split_by_space[i][idx] != '[') {
          tmp_str = "";
          while (split_by_space[i][idx] != '[' && idx < split_by_space[i].length) {
            tmp_str += split_by_space[i][idx];
            idx++;
          }
          word_questions.push(tmp_str);
        }
        else {
          tmp_str = "";
          idx++;
          while (split_by_space[i][idx] != ']') {
            tmp_str += split_by_space[i][idx];
            if (idx == split_by_space[i].length - 1) {
              tmp_str = '[' + tmp_str;
              word_questions.push(tmp_str);
              is_last_word_tag = false;
              break;
            }
            idx++;
          }
          idx++;
          if (is_last_word_tag) tag_questions.push(tmp_str);
        }
      }
    }
    else {
      word_questions.push(split_by_space[i]);
    }
  }

  console.log(word_questions);
  console.log(tag_questions);
  var tag_id_set = [];

  tags.forEach(d => {
    tag_questions.forEach(l => {
      if (d.name == l) tag_id_set.push(d.tid);
    })
  })

  console.log("tag id set is " + tag_id_set);

  questions.forEach(o => {
    let q_title = o.title.toLowerCase();
    let q_text = o.text.toLowerCase();
    let q_tag = o.tagIds;

    word_questions.forEach(w => {
      if (q_title.includes(w) || q_text.includes(w)) searched_questions.push(o);
    })

    tag_id_set.forEach(t => {

      if (q_tag.includes(t)) searched_questions.push(o);

    })
  });

  console.log(searched_questions);

  sorted_questions = [];

  searched_questions.forEach(element => {
    if (!sorted_questions.includes(element)) sorted_questions.push(element);
  });

  // sorted_questions = searched_questions;
  searched = 1;
  mainPage();
  sorted_questions = questions;
}

// main question list page loading function
const mainPage = () => {
  document.getElementById("numQ").innerHTML = sorted_questions.length + " questions";
  document.getElementById("question_menu").style.background = "lightgray";
  document.getElementById("tag_menu").style.background = "none";
  document.getElementById("main_questions_load").innerHTML = null;
  document.getElementById("allQ").innerHTML = "All Questions";
  if (searched == 1 && sorted_questions.length < 1) {
    document.getElementById("allQ").innerHTML = "Search Results"
    const no_quest = document.createElement("div");
    no_quest.innerHTML = `<h2 id = "no_questions">No Questions Found </h2>`
    document.getElementById("main_questions_load").innerHTML = no_quest.innerHTML;
  }
  else {
    if (searched == 1) document.getElementById("allQ").innerHTML = "Search Results"
    got_target_quest_id = 0;

    sorted_questions.forEach((a, k) => {
      var tag_name = `<p class="quest_tag"></p>`;
      for (let p = 0; p < sorted_questions[k].tagIds.length; p++) {
        tags.forEach((b, i) => {
          if (sorted_questions[k].tagIds[p] == tags[i].tid)
            tag_name += `<p class="quest_tag">${tags[i].name}</p>`;
        });
      }

      const each_quest = document.createElement("div");
      each_quest.innerHTML = `<div id="main_questions">
        <div id="section1">
          <p id="quest_num_ans">${sorted_questions[k].ansIds.length} answers</p>
          <p id="quest_num_view">${sorted_questions[k].views} views</p>
        </div>

        <div id="section2">
          <a class="quest_title" id="${sorted_questions[k].qid}">${sorted_questions[k].title}</a>
          <div id="quest_tags>
            ${tag_name}
          </div>
        </div>

        <div id="section3">
          <p id="quest_user">${sorted_questions[k].askedBy}</p>
          <p id="quest_asked">asked</p>
          <p id="quest_time">${time_log(sorted_questions[k].askDate)}</p>
        </div>
      </div>`;

      document.getElementById("main_questions_load").innerHTML += each_quest.innerHTML;
    });
  }
  const contentsButton = document.querySelectorAll(".quest_title");
  contentsButton.forEach(content => {
    content.addEventListener('click', contButton);
  });

}

const newest_sort_default = function (arr) {
  let newest_questions = arr;
  newest_questions = arr.sort((a, b) => b.askDate - a.askDate);
  return newest_questions;
}

const newest_sort = function () {
  searched = 0;
  document.getElementById("search_input").value = "";
  let new_sorted_questions = questions;

  new_sorted_questions = new_sorted_questions.sort((a, b) => b.askDate - a.askDate);

  sorted_questions = new_sorted_questions;
  mainPage();
}

const active_sort = function () {
  searched = 0;
  document.getElementById("search_input").value = "";
  let active_sorted_questions = [];
  let sorted_answers = answers.sort((a, b) => b.ansDate - a.ansDate);
  let newest_sort = newest_sort_default(questions);

  sorted_answers.forEach(ans => {
    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < questions[i].ansIds.length; j++) {
        if (active_sorted_questions.includes(questions[i])) continue;
        else if (questions[i].ansIds[j] == ans.aid) active_sorted_questions.push(questions[i]);
      }
    }
  });

  newest_sort.forEach(e => {
    if (!active_sorted_questions.includes(e)) active_sorted_questions.push(e);
  });

  sorted_questions = active_sorted_questions;
  mainPage();
}

const unanswered_sort = function () {
  searched = 0;
  document.getElementById("search_input").value = "";
  let newest_sort = newest_sort_default(questions);
  let unanswered_sorted_questions = [];

  newest_sort.forEach(q => {
    if (q.ansIds.length < 1) unanswered_sorted_questions.push(q);
  })

  sorted_questions = unanswered_sorted_questions;
  mainPage();
}

const time_log = function (UploadedDate) {
  let currentDate = new Date();
  let diff_time_sec = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000));
  let diff_time_min = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000 * 60));
  let diff_time_hour = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000 * 60 * 60));
  let diff_time_year = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][UploadedDate.getMonth()];
  let month_idx = months.indexOf(month);
  let months_abrvs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let months_out = months_abrvs[month_idx];

  let hours = ('0' + UploadedDate.getHours()).slice(-2);
  let minutes = ('0' + UploadedDate.getMinutes()).slice(-2);
  let seconds = ('0' + UploadedDate.getSeconds()).slice(-2);
  let timeString = hours + ':' + minutes + ':' + seconds;

  if (diff_time_sec == 1) return (diff_time_sec.toString() + " second ago");
  else if (diff_time_sec < 60) return (diff_time_sec.toString() + " seconds ago");
  else if (diff_time_min == 1) return (diff_time_min.toString() + " minute ago");
  else if (diff_time_min < 60) return (diff_time_min.toString() + " minutes ago");
  else if (diff_time_hour == 1) return (diff_time_hour.toString() + " hour ago");
  else if (diff_time_hour < 24) return (diff_time_hour.toString() + " hours ago");
  else if (diff_time_year >= 1) return (months_out + " " + UploadedDate.getDate() + ", " + UploadedDate.getFullYear() + " at " + timeString);
  else return (months_out + " " + UploadedDate.getDate() + " at " + timeString);
}

// each question content page function
const content_page = () => {
  document.getElementById("question_menu").style.background = "none";
  document.getElementById("q_content_answer_area").innerHTML = null;
  console.log("id recall from content page" + target_quest_id);

  questions.forEach((a, k) => {
    if (questions[k].qid == target_quest_id) {
      questions[k].views += 1;
      document.getElementById("q_content_num_ans").innerHTML = questions[k].ansIds.length + " answers";
      document.getElementById("q_content_title").innerHTML = questions[k].title;
      document.getElementById("q_content_num_view").innerHTML = questions[k].views + " views";
      document.getElementById("q_content_text").innerHTML = questions[k].text;
      document.getElementById("q_content_user").innerHTML = questions[k].askedBy;
      document.getElementById("q_content_time").innerHTML = "asked " + time_log(questions[k].askDate);

      for (let p = 0; p < questions[k].ansIds.length; p++) {
        answers.forEach((b, j) => {
          if (questions[k].ansIds[p] == answers[j].aid) {
            console.log("current answer's id is " + answers[j].aid);
            console.log("current answer's time is " + answers[j].ansDate);
            const quest_content_ans = document.createElement("div");
            quest_content_ans.innerHTML = `<div id="q_content_answers">
              <div>
                <p id="q_content_ans_text">${answers[j].text}</p>
                <div id="content_section">
                  <p id="q_content_ans_by">${answers[j].ansBy}</p>
                  <p id="q_content_ans_time">answered ${time_log(answers[j].ansDate)}</p>
                </div>
              </div>
            </div>`;
            document.getElementById("q_content_answer_area").innerHTML += quest_content_ans.innerHTML;
          }
        });
      }
    }
  });
  const askingButton = document.getElementById("askQ_cont");
  askingButton.addEventListener('click', askButton);
}

// tag page function
const tag_page = () => {
  const askingButton = document.getElementById("askQ_tag");
  askingButton.addEventListener('click', askButton);

  document.getElementById("question_menu").style.background = "none";
  document.getElementById("tag_menu").style.background = "lightgray";
  document.getElementById("num_tags").innerHTML = tags.length + " Tags";
  document.getElementById("tags_area").innerHTML = `<br></br>`;

  for (let i = 0; i < tags.length; i++) {
    const tag_content = document.createElement("div");

    let tag_count = 0;

    if (i % 3 == 0) {
      questions.forEach(element => {
        element.tagIds.forEach(t => {
          if (t == tags[i].tid) tag_count++;
        })
      });

      if (tag_count == 1) {
        tag_content.innerHTML =
          `<div id="tag_content_left">
            <a class="tag_name" id ="${tags[i].tid}">${tags[i].name}</a>
            <p id="time_tag_used" >${tag_count} question</p>
          </div>`
      }
      else {
        tag_content.innerHTML =
          `<div id="tag_content_left">
            <a class="tag_name" id ="${tags[i].tid}">${tags[i].name}</a>
            <p id="time_tag_used" >${tag_count} questions</p>
          </div>`
      }


    }
    else if (i % 3 == 1) {
      questions.forEach(element => {
        element.tagIds.forEach(t => {
          if (t == tags[i].tid) tag_count++;
        })
      });

      if (tag_count == 1) {
        tag_content.innerHTML =
          `<div id="tag_content_middle">
            <a class="tag_name" id ="${tags[i].tid}">${tags[i].name}</a>
            <p id="time_tag_used" >${tag_count} question</p>
          </div>`
      }
      else {
        tag_content.innerHTML =
          `<div id="tag_content_middle">
            <a class="tag_name" id ="${tags[i].tid}">${tags[i].name}</a>
            <p id="time_tag_used" >${tag_count} questions</p>
          </div>`
      }
    }
    else {
      questions.forEach(element => {
        element.tagIds.forEach(t => {
          if (t == tags[i].tid) tag_count++;
        })
      });

      if (tag_count == 1) {
        tag_content.innerHTML =
          `<div id="tag_content_right">
            <a class="tag_name" id ="${tags[i].tid}">${tags[i].name}</a>
            <p id="time_tag_used" >${tag_count} question</p>
          </div>`
      }
      else {
        tag_content.innerHTML =
          `<div id="tag_content_right">
            <a class="tag_name" id ="${tags[i].tid}">${tags[i].name}</a>
            <p id="time_tag_used" >${tag_count} questions</p>
          </div>`
      }
    }

    document.getElementById("tags_area").innerHTML += tag_content.innerHTML;

  }

  const tags_name_Button = document.querySelectorAll(".tag_name");
  tags_name_Button.forEach(tag_question => {
    tag_question.addEventListener('click', tag_quest_Button);
  });
}

const tag_click_page = () => {
  const askingButton = document.getElementById("askQ_main");
  askingButton.addEventListener('click', askButton);

  const tagMenuButton = document.getElementById("tag_menu");
  tagMenuButton.addEventListener('click', tagButton);

  document.getElementById("question_menu").style.background = "none";
  document.getElementById("tag_menu").style.background = "none";
  document.getElementById("main_questions_load").innerHTML = null;

  got_target_quest_id = 0;
  got_target_tag_id = 0;

  var tag_sort_num_quest = 0;

  sorted_questions = [];

  questions.forEach(q => {
    q.tagIds.forEach(t => {
      if (t == target_tag_id) sorted_questions.push(q);
    })
  })

  sorted_questions = newest_sort_default(sorted_questions);

  sorted_questions.forEach(q => {
    let tag_name = `<p class="quest_tag"></p>`;
    q.tagIds.forEach(t1 => {
      tags.forEach(t2 => {
        if (t1 == t2.tid) tag_name += `<p class="quest_tag">${t2.name}</p>`;
      });
    });

    var each_quest = document.createElement("div");
    console.log(q.tagIds);
    for (let p = 0; p < q.tagIds.length; p++) {
      if (q.tagIds[p] == target_tag_id) {
        tag_sort_num_quest++;
        each_quest.innerHTML = `<div id="main_questions">
          <div id="section1">
            <p id="quest_num_ans">${q.ansIds.length} answers</p>
            <p id="quest_num_view">${q.views} views</p>
          </div>

          <div id="section2">
            <a class="quest_title" id="${q.qid}">${q.title}</a>
            <div id="quest_tags>
              ${tag_name}
            </div>
          </div>

          <div id="section3">
            <p id="quest_user">${q.askedBy}</p>
            <p id="quest_asked">asked</p>
            <p id="quest_time">${time_log(q.askDate)}</p>
          </div>
        </div>`;
        break;
      }
    }

    // questions.forEach((a, f) => {
    //   let tag_name = `<p class="quest_tag"></p>`;
    //   for (let p = 0; p < questions[f].tagIds.length; p++) {
    //     tags.forEach((b, i) => {
    //       if (questions[f].tagIds[p] == tags[i].tid)
    //         tag_name += `<p class="quest_tag">${tags[i].name}</p>`;
    //     });
    //   }
    //   var each_quest = document.createElement("div");
    //   console.log(questions[f].tagIds);
    //   for (let p = 0; p < questions[f].tagIds.length; p++) {
    //     if (questions[f].tagIds[p] == target_tag_id) {
    //       tag_sort_num_quest++;
    //       each_quest.innerHTML = `<div id="main_questions">
    //         <div id="section1">
    //           <p id="quest_num_ans">${questions[f].ansIds.length} answers</p>
    //           <p id="quest_num_view">${questions[f].views} views</p>
    //         </div>

    //         <div id="section2">
    //           <a class="quest_title" id="${questions[f].qid}">${questions[f].title}</a>
    //           <div id="quest_tags>
    //             ${tag_name}
    //           </div>
    //         </div>

    //         <div id="section3">
    //           <p id="quest_user">${questions[f].askedBy}</p>
    //           <p id="quest_asked">asked</p>
    //           <p id="quest_time">${time_log(questions[f].askDate)}</p>
    //         </div>
    //       </div>`;
    //       break;
    //     }
    //   }
    document.getElementById("main_questions_load").innerHTML += each_quest.innerHTML;
  });
  document.getElementById("numQ").innerHTML = tag_sort_num_quest + " questions";

  const contentsButton = document.querySelectorAll(".quest_title");
  contentsButton.forEach(content => {
    content.addEventListener('click', contButton);
  });
}

// active question button on left side
const questButton = () => {
  document.getElementById("question_content_page").style.display = "none";
  document.getElementById("ask_question_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "none";
  document.getElementById("all_question_and_buttons").style.display = "block";
  document.getElementById("tag_page").style.display = "none";
  searched = 0;
  document.getElementById("search_input").value = "";

  window.onload();
}

// active tag button on left side
const tagButton = () => {
  document.getElementById("question_content_page").style.display = "none";
  document.getElementById("ask_question_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "none";
  document.getElementById("all_question_and_buttons").style.display = "none";
  document.getElementById("tag_page").style.display = "block";
  document.getElementById("search_input").value = "";

  tag_page();
}



// active ask question button on right side
const askButton = () => {
  document.getElementById("question_menu").style.background = "none";
  document.getElementById("all_question_and_buttons").style.display = "none";
  document.getElementById("question_content_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "none";
  document.getElementById("ask_question_page").style.display = "block";
  document.getElementById("tag_page").style.display = "none";

  document.getElementById("new_q_title").value = "";
  document.getElementById("new_q_text").value = "";
  document.getElementById("new_q_user").value = "";
  document.getElementById("new_q_tag").value = "";

  const post1 = document.getElementById("post_btn");
  post1.addEventListener('click', postQuestion);
}

// active question title to show its content
const contButton = function () {
  document.getElementById("all_question_and_buttons").style.display = "none";
  document.getElementById("ask_question_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "none";
  document.getElementById("question_content_page").style.display = "block";
  document.getElementById("tag_page").style.display = "none";
  if (got_target_quest_id == 0) {
    target_quest_id = this.id;
    got_target_quest_id = 1;
  }
  content_page();

  const question1 = document.getElementById("ans_question_btn");
  question1.addEventListener('click', answerQuestion);
}

// active answer page
const answerQuestion = function () {
  document.getElementById("all_question_and_buttons").style.display = "none";
  document.getElementById("question_content_page").style.display = "none";
  document.getElementById("ask_question_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "block";
  document.getElementById("tag_page").style.display = "none";

  document.getElementById("ans_q_user").value = "";
  document.getElementById("ans_q_text").value = "";

  const answer1 = document.getElementById("ans_post_btn");
  answer1.addEventListener('click', postAnswer);
}

const tag_quest_Button = function () {
  document.getElementById("all_question_and_buttons").style.display = "block";
  document.getElementById("ask_question_page").style.display = "none";
  document.getElementById("answer_question_page").style.display = "none";
  document.getElementById("question_content_page").style.display = "none";
  document.getElementById("tag_page").style.display = "none";
  if (got_target_tag_id == 0) {
    target_tag_id = this.id;
    got_target_tag_id = 1;
  }
  tag_click_page();

  const question1 = document.getElementById("ans_question_btn");
  question1.addEventListener('click', answerQuestion);
}


// posting new question on the model.js
const postQuestion = () => {
  let new_title = document.getElementById("new_q_title").value;
  let new_text = document.getElementById("new_q_text").value;
  let new_username = document.getElementById("new_q_user").value;
  let new_tags = document.getElementById("new_q_tag").value.toLowerCase();

  let title_empty_check = true;
  let text_empty_check = true;
  let username_empty_check = true;
  let new_tag_length_check = true;

  for (let i = 0; i < new_title.length; i++) {
    if (new_title[i] != " ") title_empty_check = false;
  }

  for (let i = 0; i < new_text.length; i++) {
    if (new_text[i] != " ") text_empty_check = false;
  }

  for (let i = 0; i < new_username.length; i++) {
    if (new_username[i] != " ") username_empty_check = false;
  }

  for (let i = 0; i < new_tags.length; i++)  // deleting unnecessary characters
  {
    new_tags = new_tags.replaceAll("  ", " ");

    if ((new_tags[i] >= 'a' && new_tags[i] <= 'z') || (new_tags[i] === '-') || (new_tags[i] === ' ') || (new_tags[i] >= '0' && new_tags[i] <= '9')) {
      continue;
    }
    else {
      new_tags = new_tags.slice(0, i) + new_tags.slice(i + 1);
      i--;
    }
  }

  if (new_tags[new_tags.length - 1] === ' ') new_tags = new_tags.slice(0, new_tags.length - 1);

  const tags_arr = new_tags.split(" ");

  for (let i = 0; i < tags_arr.length; i++) {
    if (tags_arr[i].length > 10) new_tag_length_check = false;
    console.log(tags_arr[i]);
  }

  if (tags_arr.length > 5) alert("Tags should be less or equal than 5.");
  else if (!new_tag_length_check) alert("The tag cannot be more than 10 characters.")
  else if (new_title.length > 100) alert("The title should not be more than 100 characters");
  else if (title_empty_check) alert("The title should not be empty");
  else if (text_empty_check) alert("The question text should not be empty");
  else if (username_empty_check) alert("The username should not be empty");
  else {
    let newQuest = {
      qid: 'q' + (questions.length + 1),
      title: new_title,
      text: new_text,
      tagIds: [],
      askedBy: new_username,
      askDate: new Date(),
      ansIds: [],
      views: 0,
    };

    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < tags_arr.length; j++) {
        if (tags[i].name === tags_arr[j]) {
          newQuest.tagIds.push(tags[i].tid);
          break;
        }
      }
    }

    for (let i = 0; i < tags_arr.length; i++) {
      let tag_exists = false;
      for (let j = 0; j < tags.length; j++) {
        if (tags[j].name === tags_arr[i]) {
          tag_exists = true;
          break;
        }
      }

      if (!tag_exists) {
        tags.push({ tid: 't' + (tags.length + 1).toString(), name: tags_arr[i] });
        newQuest.tagIds.push(tags[tags.length - 1].tid);
      }
    }

    questions.push(newQuest);
    questButton();
  }

  for (let i = 0; i < questions.length; i++) {
    console.log(mod.data.questions[i]);
  }

  for (let i = 0; i < tags.length; i++) {
    console.log("tid: " + tags[i].tid + ", name: " + tags[i].name);
  }
}

// posting new answer on the model.js
const postAnswer = function () {
  let new_ans_username = document.getElementById("ans_q_user").value;
  let new_ans_text = document.getElementById("ans_q_text").value;
  let username_empty_check = true;
  let text_empty_check = true;

  for (let i = 0; i < new_ans_text.length; i++) {
    if (new_ans_text[i] != " ") text_empty_check = false;
  }

  for (let i = 0; i < new_ans_username.length; i++) {
    if (new_ans_username[i] != " ") username_empty_check = false;
  }

  if (text_empty_check) alert("The answer text should not be empty");
  else if (username_empty_check) alert("The username should not be empty");
  else {
    let newAns = {
      aid: 'a' + (answers.length + 1),
      text: new_ans_text,
      ansBy: new_ans_username,
      ansDate: new Date(),
    };
    answers.push(newAns);

    questions.forEach((a, s) => {
      if (questions[s].qid == target_quest_id) {
        questions[s].ansIds.push(newAns.aid)
        questions[s].views -= 1;
        console.log(questions[s].ansIds);
      }
    });

    contButton();
  }


}
