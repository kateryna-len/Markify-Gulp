const block = document.getElementById('mobile');

function myFunction() {
  if (block.style.display === 'block') {
    document.getElementById('mobile').style.display = 'none';
  } else {
    document.getElementById('mobile').style.display = 'block';
  }
}
