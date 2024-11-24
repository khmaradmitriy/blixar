import React from 'react';
import { Form, Button } from 'react-bootstrap';

const AuthForm = ({ title, fields, buttonText, onSubmit, link }) => (
  <Form onSubmit={onSubmit} className="p-4 border rounded shadow-sm" style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
    <h2 className="text-center">{title}</h2>
    {fields.map((field) => (
      <Form.Group key={field.name} className="mb-3">
        <Form.Label>{field.label}</Form.Label>
        <Form.Control
          type={field.type || 'text'}
          placeholder={field.placeholder}
          value={field.value}
          onChange={field.onChange}
          required
        />
      </Form.Group>
    ))}
    <Button variant="primary" type="submit" className="w-100">
      {buttonText}
    </Button>
    {link && (
      <div className="mt-3 text-center">
        <a href={link.href}>{link.text}</a>
      </div>
    )}
  </Form>
);

export default AuthForm;
