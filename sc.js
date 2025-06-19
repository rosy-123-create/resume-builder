 const educationContainer = document.getElementById('educationFields');
    const experienceContainer = document.getElementById('experienceFields');
    const formInputs = ['name', 'email', 'phone', 'summary'];
    const totalFields = formInputs.length + 2; // +2 for education and experience

    function addEducation() {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'education';
      input.placeholder = 'Degree, School, Year';
      input.addEventListener('input', updatePreview);
      educationContainer.appendChild(input);
      updateProgress();
    }

    function addExperience() {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'experience';
      input.placeholder = 'Job Title, Company, Years';
      input.addEventListener('input', updatePreview);
      experienceContainer.appendChild(input);
      updateProgress();
    }

    function clearForm() {
      document.getElementById('resumeForm').reset();
      educationContainer.innerHTML = '';
      experienceContainer.innerHTML = '';
      addEducation();
      addExperience();
      updatePreview();
      updateProgress();
    }

    function updatePreview() {
      document.getElementById('previewName').textContent = document.getElementById('name').value || 'Your Name';
      document.getElementById('previewEmail').textContent = document.getElementById('email').value;
      document.getElementById('previewPhone').textContent = document.getElementById('phone').value;
      document.getElementById('previewSummary').textContent = document.getElementById('summary').value;

      const eduList = document.getElementById('previewEducation');
      eduList.innerHTML = '';
      document.querySelectorAll('.education').forEach(input => {
        if (input.value.trim()) {
          const li = document.createElement('li');
          li.textContent = input.value;
          eduList.appendChild(li);
        }
      });

      const expList = document.getElementById('previewExperience');
      expList.innerHTML = '';
      document.querySelectorAll('.experience').forEach(input => {
        if (input.value.trim()) {
          const li = document.createElement('li');
          li.textContent = input.value;
          expList.appendChild(li);
        }
      });

      const skills = document.querySelectorAll('.skill:checked');
      const skillBox = document.getElementById('previewSkills');
      skillBox.innerHTML = '';
      skills.forEach(skill => {
        const span = document.createElement('span');
        span.textContent = skill.value;
        skillBox.appendChild(span);
      });

      updateProgress();
    }

    function updateProgress() {
      let filled = 0;
      formInputs.forEach(id => {
        if (document.getElementById(id).value.trim()) filled++;
      });

      const educations = document.querySelectorAll('.education');
      const experiences = document.querySelectorAll('.experience');
      if ([...educations].some(e => e.value.trim())) filled++;
      if ([...experiences].some(e => e.value.trim())) filled++;

      const percent = Math.floor((filled / totalFields) * 100);
      document.getElementById('progressBar').style.width = percent + '%';
    }

    async function downloadPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text(`Name: ${document.getElementById('previewName').textContent}`, 10, 20);
      doc.text(`Email: ${document.getElementById('previewEmail').textContent}`, 10, 30);
      doc.text(`Phone: ${document.getElementById('previewPhone').textContent}`, 10, 40);
      doc.text('Summary:', 10, 50);
      doc.text(document.getElementById('previewSummary').textContent || '', 10, 58);

      doc.text('Education:', 10, 70);
      let y = 78;
      document.querySelectorAll('#previewEducation li').forEach(li => {
        doc.text(`• ${li.textContent}`, 12, y);
        y += 8;
      });

      doc.text('Skills:', 10, y);
      y += 8;
      const skills = [...document.querySelectorAll('#previewSkills span')].map(s => s.textContent).join(', ');
      doc.text(skills, 12, y);
      y += 12;

      doc.text('Experience:', 10, y);
      y += 8;
      document.querySelectorAll('#previewExperience li').forEach(li => {
        doc.text(`• ${li.textContent}`, 12, y);
        y += 8;
      });

      doc.save('Resume.pdf');
    }

    // Initialize default inputs
    document.getElementById('resumeForm').addEventListener('input', updatePreview);
    document.querySelectorAll('.skill').forEach(chk => {
      chk.addEventListener('change', updatePreview);
    });
    window.onload = () => {
      addEducation();
      addExperience();
      updatePreview();
    };
